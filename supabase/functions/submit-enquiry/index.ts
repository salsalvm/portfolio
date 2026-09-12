import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/

function sanitize(value, max = 2000) {
  return String(value ?? '')
    .trim()
    .slice(0, max)
}

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

async function sendEmail({ apiKey, from, to, subject, html, replyTo, cc }) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      html,
      ...(replyTo ? { reply_to: replyTo } : {}),
      ...(cc?.length ? { cc } : {}),
    }),
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data?.message || `Email failed (${response.status})`)
  }
  return data
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return json(405, { ok: false, error: 'Method not allowed' })
  }

  try {
    const body = await req.json()
    const name = sanitize(body?.name, 120)
    const email = sanitize(body?.email, 180).toLowerCase()
    const subject = sanitize(body?.subject, 200)
    const message = sanitize(body?.message, 4000)

    if (!name || !email || !subject || !message) {
      return json(400, { ok: false, error: 'All fields are required.' })
    }
    if (!EMAIL_REGEX.test(email)) {
      return json(400, { ok: false, error: 'Enter a valid email address.' })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    const fromEmail =
      Deno.env.get('ENQUIRY_FROM_EMAIL') || 'Portfolio <onboarding@resend.dev>'
    const notifyEmail =
      Deno.env.get('ENQUIRY_NOTIFY_EMAIL') || 'salsalvm1997@gmail.com'

    if (!supabaseUrl || !serviceRoleKey) {
      return json(500, { ok: false, error: 'Server is not configured.' })
    }

    const admin = createClient(supabaseUrl, serviceRoleKey)
    const { error: insertError } = await admin.from('enquiry').insert({
      name,
      email,
      subject,
      message,
    })

    if (insertError) {
      console.error('enquiry insert failed:', insertError)
      return json(500, { ok: false, error: insertError.message || 'Could not save message.' })
    }

    const emailErrors = []

    if (resendApiKey) {
      const safeName = escapeHtml(name)
      const safeSubject = escapeHtml(subject)
      const safeMessage = escapeHtml(message).replaceAll('\n', '<br />')
      const safeEmail = escapeHtml(email)

      try {
        // Confirmation to the person who submitted the enquiry
        await sendEmail({
          apiKey: resendApiKey,
          from: fromEmail,
          to: email,
          cc: email.toLowerCase() === 'salsalvm1997@gmail.com' ? undefined : ['salsalvm1997@gmail.com'],
          subject: `We received your enquiry — ${subject}`,
          html: `
            <p>Hi ${safeName},</p>
            <p>Thank you for your enquiry. We have received your message successfully.</p>
            <p><strong>We will contact you soon.</strong></p>
            <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;" />
            <p><strong>Your received enquiry:</strong></p>
            <p><strong>Name:</strong> ${safeName}</p>
            <p><strong>Email:</strong> ${safeEmail}</p>
            <p><strong>Subject:</strong> ${safeSubject}</p>
            <p><strong>Message:</strong><br />${safeMessage}</p>
            <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;" />
            <p>Best regards,<br />Salsal VM</p>
          `,
        })
      } catch (err) {
        console.error('submitter email failed:', err)
        emailErrors.push(`submitter: ${err.message}`)
      }

      try {
        // Notify portfolio owner
        await sendEmail({
          apiKey: resendApiKey,
          from: fromEmail,
          to: notifyEmail,
          cc:
            notifyEmail.toLowerCase() === 'salsalvm1997@gmail.com'
              ? undefined
              : ['salsalvm1997@gmail.com'],
          replyTo: email,
          subject: `New portfolio enquiry from ${name}`,
          html: `
            <p>New enquiry received.</p>
            <p><strong>Name:</strong> ${safeName}</p>
            <p><strong>Email:</strong> ${safeEmail}</p>
            <p><strong>Subject:</strong> ${safeSubject}</p>
            <p><strong>Message:</strong><br />${safeMessage}</p>
          `,
        })
      } catch (err) {
        console.error('owner email failed:', err)
        emailErrors.push(`owner: ${err.message}`)
      }
    } else {
      console.warn('RESEND_API_KEY missing — enquiry saved without email.')
    }

    return json(201, {
      ok: true,
      emailed: Boolean(resendApiKey) && emailErrors.length === 0,
      emailErrors: emailErrors.length ? emailErrors : undefined,
    })
  } catch (error) {
    console.error('submit-enquiry failed:', error)
    return json(500, { ok: false, error: 'Could not save message. Try again.' })
  }
})

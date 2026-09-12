import cors from 'cors'
import express from 'express'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataDir = path.join(__dirname, 'data')
const enquiryFile = path.join(dataDir, 'enquiry.json')
const PORT = Number(process.env.PORT) || 3001
const RESEND_API_KEY = process.env.RESEND_API_KEY || ''
const ENQUIRY_FROM_EMAIL =
  process.env.ENQUIRY_FROM_EMAIL || 'Portfolio <onboarding@resend.dev>'
const ENQUIRY_NOTIFY_EMAIL =
  process.env.ENQUIRY_NOTIFY_EMAIL || 'salsalvm1997@gmail.com'

async function ensureStore() {
  await mkdir(dataDir, { recursive: true })
  try {
    await readFile(enquiryFile, 'utf8')
  } catch {
    await writeFile(enquiryFile, '[]\n', 'utf8')
  }
}

async function readEnquiries() {
  await ensureStore()
  const raw = await readFile(enquiryFile, 'utf8')
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

async function writeEnquiries(enquiries) {
  await ensureStore()
  await writeFile(enquiryFile, `${JSON.stringify(enquiries, null, 2)}\n`, 'utf8')
}

function sanitize(value, max = 2000) {
  return String(value ?? '')
    .trim()
    .slice(0, max)
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

async function sendEmail({ to, subject, html, replyTo, cc }) {
  if (!RESEND_API_KEY) return false

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: ENQUIRY_FROM_EMAIL,
      to: [to],
      subject,
      html,
      ...(replyTo ? { reply_to: replyTo } : {}),
      ...(cc?.length ? { cc } : {}),
    }),
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data?.message || `Email failed (${response.status})`)
  }
  return true
}

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/

const app = express()
app.use(cors())
app.use(express.json({ limit: '32kb' }))

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.post('/api/enquiry', async (req, res) => {
  try {
    const name = sanitize(req.body?.name, 120)
    const email = sanitize(req.body?.email, 180)
    const subject = sanitize(req.body?.subject, 200)
    const message = sanitize(req.body?.message, 4000)

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ ok: false, error: 'All fields are required.' })
    }

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ ok: false, error: 'Enter a valid email address.' })
    }

    const entry = {
      id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name,
      email,
      subject,
      message,
      createdAt: new Date().toISOString(),
    }

    const enquiries = await readEnquiries()
    enquiries.unshift(entry)
    await writeEnquiries(enquiries)

    let emailed = false
    if (RESEND_API_KEY) {
      const safeName = escapeHtml(name)
      const safeSubject = escapeHtml(subject)
      const safeMessage = escapeHtml(message).replaceAll('\n', '<br />')
      const safeEmail = escapeHtml(email)

      try {
        await sendEmail({
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
        await sendEmail({
          to: ENQUIRY_NOTIFY_EMAIL,
          cc:
            ENQUIRY_NOTIFY_EMAIL.toLowerCase() === 'salsalvm1997@gmail.com'
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
        emailed = true
      } catch (emailError) {
        console.error('Enquiry saved but email failed:', emailError.message)
      }
    }

    return res.status(201).json({ ok: true, id: entry.id, emailed })
  } catch (error) {
    console.error('Failed to save enquiry:', error)
    return res.status(500).json({ ok: false, error: 'Could not save message. Try again.' })
  }
})

app.get('/api/enquiries', async (_req, res) => {
  try {
    const enquiries = await readEnquiries()
    return res.json({ ok: true, count: enquiries.length, enquiries })
  } catch (error) {
    console.error('Failed to read enquiries:', error)
    return res.status(500).json({ ok: false, error: 'Could not load messages.' })
  }
})

await ensureStore()

const server = app.listen(PORT)

server.on('listening', () => {
  console.log(`Enquiry API running at http://localhost:${PORT}`)
})

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(
      `Port ${PORT} is already in use. Stop the other process (lsof -i :${PORT}) or set PORT to a different value.`,
    )
  } else {
    console.error('Failed to start Enquiry API:', error.message)
  }
  process.exit(1)
})

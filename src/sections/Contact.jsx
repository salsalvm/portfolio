import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiSend } from 'react-icons/fi'
import { personal } from '../data'
import { trackContactSubmit } from '../lib/analytics'
import { submitContact } from '../lib/contacts'
import SectionHeading from '../components/SectionHeading'
import GlassCard from '../components/GlassCard'
import Button from '../components/Button'
import SocialLinks from '../components/SocialLinks'

const initialForm = {
  name: '',
  email: '',
  subject: '',
  message: '',
}

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/

function isValidEmail(email) {
  const value = email.trim()
  if (!value || value.length > 180) return false
  return EMAIL_REGEX.test(value)
}

export default function Contact() {
  const [form, setForm] = useState(initialForm)
  const [fieldErrors, setFieldErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const isSubmitting = status === 'loading'

  const validateForm = () => {
    const nextErrors = {}

    if (!form.name.trim()) nextErrors.name = 'Name is required.'
    if (!form.email.trim()) {
      nextErrors.email = 'Email is required.'
    } else if (!isValidEmail(form.email)) {
      nextErrors.email = 'Enter a valid email address (example: name@gmail.com).'
    }
    if (!form.subject.trim()) nextErrors.subject = 'Subject is required.'
    if (!form.message.trim()) nextErrors.message = 'Message is required.'

    setFieldErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  const handleEmailBlur = () => {
    if (!form.email.trim()) {
      setFieldErrors((prev) => ({ ...prev, email: 'Email is required.' }))
      return
    }
    if (!isValidEmail(form.email)) {
      setFieldErrors((prev) => ({
        ...prev,
        email: 'Enter a valid email address (example: name@gmail.com).',
      }))
      return
    }
    setFieldErrors((prev) => {
      const next = { ...prev }
      delete next.email
      return next
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (isSubmitting) return

    setError('')

    if (!validateForm()) {
      setStatus('error')
      setError('Please fix the highlighted fields.')
      return
    }

    setStatus('loading')

    try {
      await submitContact({
        name: form.name,
        email: form.email,
        subject: form.subject,
        message: form.message,
      })

      trackContactSubmit()
      setForm({
        name: '',
        email: '',
        subject: '',
        message: '',
      })
      setFieldErrors({})
      setError('')
      setStatus('success')
      event.target.reset()
      setTimeout(() => setStatus('idle'), 4000)
    } catch (err) {
      setStatus('error')
      setError(err.message || 'Something went wrong.')
    }
  }

  const inputClass = (hasError) =>
    `mt-2 w-full rounded-2xl border bg-bg-elevated px-4 py-3 text-text placeholder:text-muted/50 disabled:opacity-60 ${
      hasError
        ? 'border-red-400/70 focus:border-red-400'
        : 'border-border focus:border-border-strong'
    }`

  return (
    <section id="contact" className="section-pad">
      <div className="container-max">
        <SectionHeading
          title="Contact"
          subtitle="Let's build something exceptional"
        />

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <GlassCard className="h-full p-4 sm:p-5 md:p-7" hover={false}>
              <h3 className="font-display text-xl font-semibold tracking-tight text-text sm:text-2xl md:text-3xl">Get in touch</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">
                Open to senior Flutter, mobile engineering, and full stack opportunities.
                Reach out for collaborations, product builds, or a conversation about your next app.
              </p>

              <div className="mt-6 space-y-3 text-sm">
                <a href={`mailto:${personal.email}`} className="block text-accent hover:underline">
                  {personal.email}
                </a>
                <a href={`tel:${personal.phone.replace(/\s/g, '')}`} className="block text-muted hover:text-text">
                  {personal.phone}
                </a>
              </div>

              <div className="mt-6">
                <SocialLinks social={personal.social} />
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            <GlassCard className="p-4 sm:p-5 md:p-7" hover={false}>
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <fieldset
                  disabled={isSubmitting}
                  className="min-w-0 space-y-4 border-0 p-0 disabled:opacity-70"
                >
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm text-muted">
                    Name
                    <input
                      required
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className={inputClass(Boolean(fieldErrors.name))}
                      placeholder="Your name"
                    />
                    {fieldErrors.name && (
                      <span className="mt-1.5 block text-xs text-red-400">{fieldErrors.name}</span>
                    )}
                  </label>
                  <label className="block text-sm text-muted">
                    Email
                    <input
                      required
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      onBlur={handleEmailBlur}
                      inputMode="email"
                      autoComplete="email"
                      className={inputClass(Boolean(fieldErrors.email))}
                      placeholder="you@email.com"
                    />
                    {fieldErrors.email && (
                      <span className="mt-1.5 block text-xs text-red-400">{fieldErrors.email}</span>
                    )}
                  </label>
                </div>

                <label className="block text-sm text-muted">
                  Subject
                  <input
                    required
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    className={inputClass(Boolean(fieldErrors.subject))}
                    placeholder="How can I help?"
                  />
                  {fieldErrors.subject && (
                    <span className="mt-1.5 block text-xs text-red-400">{fieldErrors.subject}</span>
                  )}
                </label>

                <label className="block text-sm text-muted">
                  Message
                  <textarea
                    required
                    name="message"
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    className={inputClass(Boolean(fieldErrors.message))}
                    placeholder="Tell me about your project or role..."
                  />
                  {fieldErrors.message && (
                    <span className="mt-1.5 block text-xs text-red-400">{fieldErrors.message}</span>
                  )}
                </label>

                <div className="flex flex-wrap items-center gap-4">
                  <Button type="submit" disabled={isSubmitting}>
                    <FiSend />
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                  {status === 'success' && (
                    <span className="text-sm text-accent">
                      Message saved. Thank you!
                    </span>
                  )}
                  {status === 'error' && error && (
                    <span className="text-sm text-red-400">{error}</span>
                  )}
                </div>
                </fieldset>
              </form>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

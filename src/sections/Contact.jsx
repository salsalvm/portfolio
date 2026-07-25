import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiSend } from 'react-icons/fi'
import { personal } from '../data'
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

export default function Contact() {
  const [form, setForm] = useState(initialForm)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    console.log('Contact form submitted:', form)
    setSubmitted(true)
    setForm(initialForm)
    setTimeout(() => setSubmitted(false), 3500)
  }

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
            <GlassCard className="h-full p-5 md:p-7" hover={false}>
              <h3 className="font-display text-2xl font-semibold tracking-tight text-text md:text-3xl">Get in touch</h3>
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
            <GlassCard className="p-5 md:p-7" hover={false}>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm text-muted">
                    Name
                    <input
                      required
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-2xl border border-border bg-bg-elevated px-4 py-3 text-text placeholder:text-muted/50 focus:border-border-strong"
                      placeholder="Your name"
                    />
                  </label>
                  <label className="block text-sm text-muted">
                    Email
                    <input
                      required
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-2xl border border-border bg-bg-elevated px-4 py-3 text-text placeholder:text-muted/50 focus:border-border-strong"
                      placeholder="you@email.com"
                    />
                  </label>
                </div>

                <label className="block text-sm text-muted">
                  Subject
                  <input
                    required
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-2xl border border-border bg-bg-elevated px-4 py-3 text-text placeholder:text-muted/50 focus:border-border-strong"
                    placeholder="How can I help?"
                  />
                </label>

                <label className="block text-sm text-muted">
                  Message
                  <textarea
                    required
                    name="message"
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    className="mt-2 w-full resize-y rounded-2xl border border-border bg-bg-elevated px-4 py-3 text-text placeholder:text-muted/50 focus:border-border-strong"
                    placeholder="Tell me about your project or role..."
                  />
                </label>

                <div className="flex flex-wrap items-center gap-4">
                  <Button type="submit">
                    <FiSend />
                    Send Message
                  </Button>
                  {submitted && (
                    <span className="text-sm text-accent">
                      Message logged to console. Thank you!
                    </span>
                  )}
                </div>
              </form>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

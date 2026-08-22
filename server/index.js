import cors from 'cors'
import express from 'express'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataDir = path.join(__dirname, 'data')
const enquiryFile = path.join(dataDir, 'enquiry.json')
const PORT = Number(process.env.PORT) || 3001

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

    return res.status(201).json({ ok: true, id: entry.id })
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

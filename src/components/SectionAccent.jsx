export default function SectionAccent({ side = 'left' }) {
  const position = side === 'right' ? 'right-0' : 'left-0'
  const gradient =
    side === 'right'
      ? 'bg-gradient-to-l from-accent/10 via-accent/5 to-transparent'
      : 'bg-gradient-to-r from-accent/10 via-accent/5 to-transparent'

  return (
    <div
      className={`pointer-events-none absolute inset-y-0 ${position} w-40 md:w-64 ${gradient}`}
      aria-hidden
    />
  )
}

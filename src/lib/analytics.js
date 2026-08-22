/**
 * Google Analytics 4 helpers.
 * Visitors → automatic page views.
 * Contacts → event only (not full message body; GA is not a CRM).
 */

export function initAnalytics(measurementId) {
  if (!measurementId || typeof window === 'undefined') return
  if (window.__gaInitialized) return

  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    window.dataLayer.push(arguments)
  }

  window.gtag('js', new Date())
  window.gtag('config', measurementId, {
    anonymize_ip: true,
    send_page_view: true,
  })

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
  document.head.appendChild(script)

  window.__gaInitialized = true
}

export function trackEvent(eventName, params = {}) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag('event', eventName, params)
}

/** Fires when contact form saves successfully (no email/message content). */
export function trackContactSubmit() {
  trackEvent('contact_form_submit', {
    event_category: 'engagement',
    event_label: 'contact',
  })
}

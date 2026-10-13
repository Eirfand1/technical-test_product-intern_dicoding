/**
 * Decode HTML entities so escaped HTML (e.g. "&lt;h2&gt;") can be treated as
 * real HTML. Safe to call on already-plain text.
 *
 * NOTE: This helper must only run in the browser (uses document). It is used
 * when seeding the WYSIWYG editor from stored data.
 */
export function decodeHtmlEntities(html: string): string {
  if (typeof document === 'undefined') {
    // Fallback for SSR: handle the common entities only.
    return html
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
  }

  const el = document.createElement('textarea')
  el.innerHTML = html
  return el.value
}

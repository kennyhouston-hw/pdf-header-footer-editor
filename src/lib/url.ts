export function buildLinkUrl(baseUrl: string, utmSource: string, utmMedium: string): string {
  const trimmedBase = baseUrl.trim()
  if (!trimmedBase) return ""

  const params: [string, string][] = []
  if (utmSource.trim()) params.push(["utm_source", utmSource.trim()])
  if (utmMedium.trim()) params.push(["utm_medium", utmMedium.trim()])
  if (params.length === 0) return trimmedBase

  try {
    const url = new URL(trimmedBase)
    for (const [key, value] of params) url.searchParams.set(key, value)
    return url.toString()
  } catch {
    const separator = trimmedBase.includes("?") ? "&" : "?"
    return trimmedBase + separator + params.map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join("&")
  }
}

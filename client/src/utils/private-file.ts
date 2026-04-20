export function withPrivateFileToken(url?: string | null) {
  if (!url) return ''
  const legacyMatch = url.match(/^\/uploads\/(certs|resumes|speech)\/([^?#]+)(.*)$/)
  if (legacyMatch) {
    url = `/api/private-uploads/${legacyMatch[1]}/${legacyMatch[2]}${legacyMatch[3] || ''}`
  }
  if (!url.startsWith('/api/private-uploads/')) return url
  const token = localStorage.getItem('token')
  if (!token) return url
  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}token=${encodeURIComponent(token)}`
}
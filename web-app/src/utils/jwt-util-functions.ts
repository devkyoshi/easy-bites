export const decodeJwt = (token: string): { exp?: number } | null => {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Error decoding JWT:', e)
    return null
  }
}
export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeJwt(token)
  if (!decoded || !decoded.exp) return true
  return Date.now() >= decoded.exp * 1000
}

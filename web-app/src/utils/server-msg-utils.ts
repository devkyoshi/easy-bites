export function formatBackendMessage(code: string): string {
  return code
    .toLowerCase() // Make all lowercase: "user_not_found"
    .split('_') // Split into ["user", "not", "found"]
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each
    .join(' ') // Join with space: "User Not Found"
}

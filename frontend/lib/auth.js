/**
 * Checks if the user is currently authenticated by looking for a JWT token
 * in localStorage. Safely guards against SSR hydration attempts.
 * 
 * @returns {boolean} True if authenticated, false otherwise.
 */
export function isAuthenticated() {
  if (typeof window === "undefined") {
    // If we're on the server, we assume not authenticated
    return false;
  }
  
  const token = localStorage.getItem("token");
  return !!token;
}

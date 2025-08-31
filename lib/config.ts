export const config = {
  // Detect the current domain dynamically
  getDomain: () => {
    if (typeof window !== 'undefined') {
      // Client-side: use current location
      return window.location.origin
    }
    
    // Server-side: use environment variable or default
    return process.env.NEXT_PUBLIC_SITE_URL || 
           process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
           'http://localhost:3000'
  },
  
  // Get the base URL for the current environment
  getBaseUrl: () => {
    const domain = config.getDomain()
    return domain.replace(/^https?:\/\//, '').replace(/^www\./, '')
  },
  
  // Check if we're in production
  isProduction: () => {
    return process.env.NODE_ENV === 'production'
  }
} 
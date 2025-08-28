'use client'

import { useEffect } from 'react'

interface ClientRedirectProps {
  url: string
}

export default function ClientRedirect({ url }: ClientRedirectProps) {
  useEffect(() => {
    // Immediate redirect
    window.location.href = url
  }, [url])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-2xl p-8 shadow-lg text-center max-w-md">
        <div className="mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Redirecting...</h2>
        <p className="text-gray-600 text-sm mb-4">
          Taking you to your destination
        </p>
        <a 
          href={url}
          className="text-orange-500 hover:text-orange-600 underline text-sm"
        >
          Click here if not redirected automatically
        </a>
      </div>
    </div>
  )
}
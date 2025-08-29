"use client"
import { useState } from "react"
import type React from "react"
import { motion } from "framer-motion"

import { WaitlistWrapper } from "@/components/box"
import { useToast } from "@/hooks/use-toast"
import { Copy, ExternalLink } from "lucide-react"

export const metadata = {
  openGraph: {
    type: "website",
    url: "https://ssn-lat.vercel.app/",
    images: [
      {
        url: "https://ssn-lat.vercel.app/lakshya.png", 
        width: 1200,
        height: 630,
        alt: "Lakshya Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://ssn-lat.vercel.app/lakshya.png"], 
  },
};



export default function Home() {
  const [url, setUrl] = useState("")
  const [customAlias, setCustomAlias] = useState("")
  const [shortenedUrl, setShortenedUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return

    setIsLoading(true)

    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          longUrl: url,
          customAlias: customAlias || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to shorten URL')
      }

      setShortenedUrl(data.shortUrl)
      toast({
        title: "URL Shortened!",
        description: "Your short URL has been created successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to shorten URL",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortenedUrl)
      toast({
        title: "Copied!",
        description: "Short URL copied to clipboard.",
      })
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Please copy the URL manually.",
        variant: "destructive",
      })
    }
  }

  return (
    <WaitlistWrapper>
      <motion.div
        className="space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-12 text-balance">ssn.lat</h1>
        <p className="text-slate-10 text-pretty leading-relaxed">
          Transform your long URLs into clean, shareable links.
        </p>
      </motion.div>

      <motion.div
        className="w-full space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <form onSubmit={handleShorten} className="space-y-4">
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste your long URL here..."
              className="w-full px-4 py-3 bg-gray-11/5 border border-gray-11/10 rounded-xl text-slate-12 placeholder:text-gray-9 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/30 transition-all"
              required
              disabled={isLoading}
            />

            <input
              type="text"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value.replace(/[^a-zA-Z0-9-]/g, ""))}
              placeholder="Custom alias (optional)"
              className="w-full px-4 py-3 bg-gray-11/5 border border-gray-11/10 rounded-xl text-slate-12 placeholder:text-gray-9 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/30 transition-all"
              disabled={isLoading}
            />
          </motion.div>

          <motion.button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Shortening...
              </div>
            ) : (
              "Shorten URL"
            )}
          </motion.button>
        </form>

        {shortenedUrl && (
          <motion.div
            className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 border border-orange-200 dark:border-orange-800/30 rounded-xl p-4 space-y-3"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-orange-600 dark:text-orange-400 font-medium mb-1">Your shortened URL:</p>
                <div className="flex items-center gap-2">
                  <a
                    href={shortenedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-700 dark:text-orange-300 font-medium hover:underline truncate flex items-center gap-1"
                  >
                    {shortenedUrl}
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>
                </div>
              </div>
              <motion.button
                onClick={copyToClipboard}
                className="flex items-center gap-1 bg-orange-600 hover:bg-orange-700 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Copy className="w-3 h-3" />
                Copy
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </WaitlistWrapper>
  )
}

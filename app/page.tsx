"use client"
import { useState } from "react"
import type React from "react"

import { WaitlistWrapper } from "@/components/box"
import { useToast } from "@/hooks/use-toast"
import { Copy, ExternalLink } from "lucide-react"

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

    setTimeout(() => {
      const shortCode = customAlias || Math.random().toString(36).substring(2, 8)
      const shortened = `https://ssn.ly/${shortCode}`
      setShortenedUrl(shortened)
      setIsLoading(false)

      toast({
        title: "URL Shortened!",
        description: "Your short URL has been created successfully.",
      })
    }, 1000)
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
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-12 text-balance">SSN Shorten</h1>
        <p className="text-slate-10 text-pretty leading-relaxed">
          Transform your long URLs into clean, shareable links for your college community.
        </p>
      </div>

      <div className="w-full space-y-6">
        <form onSubmit={handleShorten} className="space-y-4">
          <div className="space-y-3">
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
          </div>

          <button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Shortening...
              </div>
            ) : (
              "Shorten URL"
            )}
          </button>
        </form>

        {shortenedUrl && (
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 border border-orange-200 dark:border-orange-800/30 rounded-xl p-4 space-y-3 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
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
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1 bg-orange-600 hover:bg-orange-700 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors"
              >
                <Copy className="w-3 h-3" />
                Copy
              </button>
            </div>
          </div>
        )}
      </div>
    </WaitlistWrapper>
  )
}

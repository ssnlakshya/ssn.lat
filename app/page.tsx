"use client"
import { useState, useRef } from "react"
import type React from "react"
import { motion } from "framer-motion"

import { WaitlistWrapper } from "@/components/box"
import { useToast } from "@/hooks/use-toast"
import { Copy, ExternalLink } from "lucide-react"
import { Filter } from "bad-words";
import words from "an-array-of-english-words";
import { UrlShortenerForm } from "@/components/url-shortener-form"

export default function Home() {
  const [url, setUrl] = useState("")
  const [customAlias, setCustomAlias] = useState("")
  const [shortenedUrl, setShortenedUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const filter = new Filter();

  // Helper: check if a string is a real English word
  function isEnglishWord(word: string) {
    return words.includes(word.toLowerCase())
  }

  const profaneWords = filter.list.map(w => w.toLowerCase())

  // Helper: check alias validity
  function isAliasValid(alias: string) {
    const lowerAlias = alias.toLowerCase()

    // block if alias directly matches or contains profanity
    for (const bad of profaneWords) {
      if (lowerAlias === bad) {
        return false
      }
      if (lowerAlias.includes(bad)) {
        // if it's a full dictionary word (like "classic"), allow
        if (isEnglishWord(lowerAlias)) {
          continue
        }
        return false // contains profanity inside but not a safe dictionary word
      }
    }

    return true
  }

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return

    if (customAlias && !isAliasValid(customAlias)) {
      toast({
        title: "Invalid alias",
        description: "Your custom alias contains inappropriate words.",
        variant: "destructive",
      });
      return;
    }

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

      <UrlShortenerForm />
    </WaitlistWrapper>
  )
}

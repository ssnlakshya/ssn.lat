"use client"
"use client"
import { motion } from "framer-motion"
import { WaitlistWrapper } from "@/components/box"
import { Filter } from "bad-words";
import words from "an-array-of-english-words";
import { UrlShortenerForm } from "@/components/url-shortener-form"

export default function Home() {
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

      <UrlShortenerForm isAliasValid={isAliasValid} />
    </WaitlistWrapper>
  )
}

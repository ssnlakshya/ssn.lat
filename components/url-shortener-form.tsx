"use client"
import { useState, useRef, useEffect } from "react"
import type React from "react"
import { QRCodeSVG } from "qrcode.react"
import { useToast } from "@/hooks/use-toast"
import { Copy, ExternalLink, QrCode, Download, ArrowLeft } from "lucide-react"

export function UrlShortenerForm() {
  const [url, setUrl] = useState("")
  const [customAlias, setCustomAlias] = useState("")
  const [shortenedUrl, setShortenedUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showQrCode, setShowQrCode] = useState(false)
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("")
  const qrCodeRef = useRef<HTMLDivElement>(null)
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
      setShowQrCode(false) // Hide QR code initially after shortening
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

  const generateQrCodeImage = () => {
    if (qrCodeRef.current) {
      const svgElement = qrCodeRef.current.querySelector('svg');
      if (svgElement) {
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);
          setQrCodeDataUrl(canvas.toDataURL('image/png'));
        };
        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
      }
    }
  };

  useEffect(() => {
    if (showQrCode && shortenedUrl) {
      generateQrCodeImage();
    }
  }, [showQrCode, shortenedUrl]);

  const downloadQrCode = () => {
    if (qrCodeDataUrl) {
      const link = document.createElement('a');
      link.href = qrCodeDataUrl;
      link.download = 'qrcode.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({
        title: "QR Code Downloaded!",
        description: "The QR code has been downloaded successfully.",
      });
    } else {
      toast({
        title: "Error",
        description: "QR Code not available for download.",
        variant: "destructive",
      });
    }
  };

  const copyQrCodeToClipboard = async () => {
    if (qrCodeDataUrl) {
      try {
        const response = await fetch(qrCodeDataUrl);
        const blob = await response.blob();
        await navigator.clipboard.write([
          new ClipboardItem({
            'image/png': blob
          })
        ]);
        toast({
          title: "QR Code Copied!",
          description: "QR Code image copied to clipboard.",
        });
      } catch (err) {
        toast({
          title: "Copy failed",
          description: "Failed to copy QR code image.",
          variant: "destructive",
        });
      }
    }
  };

  const resetForm = () => {
    setUrl("");
    setCustomAlias("");
    setShortenedUrl("");
    setIsLoading(false);
    setShowQrCode(false);
    setQrCodeDataUrl("");
  };

  return (
    <div className="w-full space-y-6 relative">
      {shortenedUrl && (
        <button
          onClick={resetForm}
          className="absolute top-0 left-0 text-orange-500 hover:text-orange-600 transition-colors flex items-center gap-1"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="sr-only">Back</span>
        </button>
      )}
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

        {!shortenedUrl ? (
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
        ) : (
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setShowQrCode(!showQrCode)}
              className="flex-shrink-0 p-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors shadow-lg hover:shadow-xl"
              aria-label="Toggle QR Code"
            >
              <QrCode className="w-6 h-6" />
            </button>
            <button
              type="button"
              onClick={downloadQrCode}
              disabled={!qrCodeDataUrl}
              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              <div className="flex items-center justify-center gap-2">
                <Download className="w-5 h-5" />
                Download QR
              </div>
            </button>
          </div>
        )}
      </form>

      {shortenedUrl && !showQrCode && (
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

      {showQrCode && shortenedUrl && (
        <div className="relative bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 border border-orange-200 dark:border-orange-800/30 rounded-xl p-4 flex flex-col items-center justify-center space-y-3 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
          <p className="text-xs text-orange-600 dark:text-orange-400 font-medium mb-1">QR Code for: {shortenedUrl}</p>
          <div ref={qrCodeRef} className="p-2 bg-white rounded-lg">
            <QRCodeSVG value={shortenedUrl} size={180} level="H" />
          </div>
          {qrCodeDataUrl && (
            <button
              onClick={copyQrCodeToClipboard}
              className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-sm font-medium rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-200"
            >
              <Copy className="w-5 h-5 mr-2" />
              Copy QR Image
            </button>
          )}
        </div>
      )}
    </div>
  )
}

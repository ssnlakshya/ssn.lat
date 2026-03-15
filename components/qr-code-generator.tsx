"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type React from "react";
import QRCode from "react-qr-code";
import { useToast } from "@/hooks/use-toast";
import {
  Download,
  Copy,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { ColorInputRow } from "./ui/ColorInputRow";
import { TextInputRow } from "./ui/TextInputRow";


interface QrCodeGeneratorProps {
  url: string;
  setUrl: React.Dispatch<React.SetStateAction<string>>;
  isValidHttpUrl: (alias: string) => boolean;
}

export function QrCodeGenerator({
  url,
  setUrl,
  isValidHttpUrl,
}: QrCodeGeneratorProps) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");
  const [showQrCode, setShowQrCode] = useState(false);
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Customization state
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [showFrame, setShowFrame] = useState(false);
  const [frameColor, setFrameColor] = useState("#f97316");
  const [frameLabel, setFrameLabel] = useState("Scan Me");
  const [frameLabelColor, setFrameLabelColor] = useState("#FFFFFF");
  const [showCustomize, setShowCustomize] = useState(false);

  const frameLabelSize = 24;

  const generateQrCodeImage = useCallback(() => {
    if (!qrCodeRef.current) return;

    const svgElement = qrCodeRef.current.querySelector("svg");
    if (!svgElement) return;

    const qrSize = 180;
    const padding = 16; // p-2 = 8px * 2
    const frameExtraPadding = showFrame ? 24 : 0;
    const frameLabelHeight = showFrame && frameLabel.trim() ? 36 : 0;

    const canvasWidth = qrSize + padding + frameExtraPadding;
    const canvasHeight =
      qrSize + padding + frameExtraPadding + frameLabelHeight;

    const canvas = document.createElement("canvas");
    const scale = 3; // High-res export
    canvas.width = canvasWidth * scale;
    canvas.height = canvasHeight * scale;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(scale, scale);

    // Draw frame background if enabled
    if (showFrame) {
      ctx.fillStyle = frameColor;
      ctx.beginPath();
      ctx.roundRect(0, 0, canvasWidth, canvasHeight, 12);
      ctx.fill();
    }

    // Draw QR background
    const qrX = (canvasWidth - qrSize - padding) / 2;
    const qrY = showFrame ? frameExtraPadding / 2 : 0;
    ctx.fillStyle = bgColor;
    ctx.beginPath();
    ctx.roundRect(qrX, qrY, qrSize + padding, qrSize + padding, 8);
    ctx.fill();

    // Draw QR code SVG
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, qrX + padding / 2, qrY + padding / 2, qrSize, qrSize);

      // Draw frame label
      if (showFrame && frameLabel.trim()) {
        ctx.fillStyle = frameLabelColor;
        ctx.font = `bold ${frameLabelSize}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(
          frameLabel,
          canvasWidth / 2,
          canvasHeight - frameLabelHeight / 2,
        );
      }

      setQrCodeDataUrl(canvas.toDataURL("image/png"));
    };
    img.src =
      "data:image/svg+xml;base64," +
      btoa(unescape(encodeURIComponent(svgData)));
  }, [bgColor, frameColor, frameLabel, frameLabelColor, showFrame]);

  useEffect(() => {
    if (url && showQrCode) {
      // Small delay to let SVG render with new props
      const timeout = setTimeout(() => generateQrCodeImage(), 100);
      return () => clearTimeout(timeout);
    }
  }, [
    url,
    showQrCode,
    fgColor,
    bgColor,
    showFrame,
    frameColor,
    frameLabel,
    frameLabelColor,
    generateQrCodeImage,
  ]);

  const handleGenerateQrCode = async () => {
    if (!isValidHttpUrl(url)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid http(s) link.",
        variant: "destructive",
      });
      return;
    }

    if (url) {
      setShowQrCode(true);
    } else {
      toast({
        title: "Error",
        description: "Please enter a URL to generate a QR code.",
        variant: "destructive",
      });
    }
  };

  const downloadQrCode = () => {
    if (qrCodeDataUrl) {
      const link = document.createElement("a");
      link.href = qrCodeDataUrl;
      link.download = "qrcode.png";
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
            "image/png": blob,
          }),
        ]);
        toast({
          title: "QR Code Copied!",
          description: "The QR code has been copied to your clipboard.",
        });
      } catch (error) {
        console.error("Failed to copy QR code:", error);
        toast({
          title: "Error",
          description: "Failed to copy QR Code to clipboard.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Error",
        description: "QR Code not available for copy.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full space-y-6 relative">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleGenerateQrCode();
        }}
        className="space-y-3"
      >
        <input
          type="url"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setShowQrCode(false);
          }}
          placeholder="Paste your long URL here..."
          className="w-full px-4 py-3 bg-gray-11/5 border border-gray-11/10 rounded-xl text-slate-12 placeholder:text-gray-9 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/30 transition-all"
          required
        />
        <button
          onClick={handleGenerateQrCode}
          disabled={!url}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
        >
          Generate QR Code
        </button>
      </form>

      {showQrCode && url && (
        <div className="relative bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 border border-orange-200 dark:border-orange-800/30 rounded-xl p-5 flex flex-col items-center justify-center space-y-4 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
          <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">
            QR Code for: {url}
          </p>

          {/* QR Code Preview — click to copy */}
          <div
            ref={qrCodeRef}
            onClick={() => qrCodeDataUrl && copyQrCodeToClipboard()}
            className={`relative flex flex-col items-center cursor-pointer [&:hover>.copy-overlay]:opacity-100 ${showFrame ? "rounded-xl" : "rounded-lg"}`}
            style={
              showFrame
                ? {
                  backgroundColor: frameColor,
                  borderRadius: "12px",
                  padding:
                    "12px 12px " +
                    (frameLabel.trim() ? "4px" : "12px") +
                    " 12px",
                }
                : undefined
            }
          >
            <div
              className="relative p-2 rounded-lg"
              style={{ backgroundColor: bgColor }}
            >
              <QRCode
                value={url}
                size={180}
                fgColor={fgColor}
                bgColor={bgColor}
              />
            </div>
            {/* Frame label */}
            {showFrame && frameLabel.trim() && (
              <p
                className="font-bold mt-1 mb-1 text-center select-none"
                style={{
                  color: frameLabelColor,
                  fontSize: `${frameLabelSize}px`,
                }}
              >
                {frameLabel}
              </p>
            )}
            {/* Copy overlay */}
            <div className={`copy-overlay absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 transition-opacity duration-200 ${showFrame ? "rounded-xl" : "rounded-lg"}`}>
              <Copy className="w-8 h-8" />
            </div>
          </div>

          {/* Customize toggle */}
          <button
            type="button"
            onClick={() => setShowCustomize(!showCustomize)}
            className="flex items-center gap-1.5 text-sm text-orange-600 dark:text-orange-400 font-medium hover:text-orange-700 dark:hover:text-orange-300 transition-colors"
          >
            {showCustomize ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
            Customize Design
          </button>

          {/* Customization controls */}
          {showCustomize && (
            <div className="w-full flex flex-col gap-4 overflow-hidden animate-in fade-in-50 slide-in-from-top-2 duration-300">
              {/* ── Colors ── */}
              <div className="flex flex-col gap-2">
                <p className="text-xs text-orange-600 dark:text-orange-400 font-semibold uppercase tracking-wider">
                  Colors
                </p>
                <div className="flex flex-col gap-3">
                  {/* QR Color */}
                  <ColorInputRow
                    label="QR Color"
                    color={fgColor}
                    onChange={setFgColor}
                  />
                  {/* Background */}
                  <ColorInputRow
                    label="Background"
                    color={bgColor}
                    onChange={setBgColor}
                  />
                </div>
              </div>

              {/* ── Frame ── */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <input
                    type="checkbox"
                    id="show-frame"
                    checked={showFrame}
                    onChange={(e) => setShowFrame(e.target.checked)}
                    className="w-4 h-4 shrink-0 rounded cursor-pointer accent-orange-500"
                  />
                  <label
                    htmlFor="show-frame"
                    className="text-xs text-orange-600 dark:text-orange-400 font-semibold uppercase tracking-wider cursor-pointer select-none"
                  >
                    Frame
                  </label>
                </div>
                {showFrame && (
                  <div className="flex flex-col gap-3 border-l-2 border-orange-300 dark:border-orange-700 pl-4 animate-in fade-in-50 duration-200">
                    {/* Frame Color */}
                    <ColorInputRow
                      label="Frame Color"
                      color={frameColor}
                      onChange={setFrameColor}
                    />
                    {/* Label Text */}
                    <TextInputRow
                      label="Label Text"
                      value={frameLabel}
                      onChange={setFrameLabel}
                      placeholder="Scan Me"
                      maxLength={20}
                    />
                    {/* Text Color */}
                    <ColorInputRow
                      label="Text Color"
                      color={frameLabelColor}
                      onChange={setFrameLabelColor}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex w-full gap-2">
            <button
              onClick={downloadQrCode}
              disabled={!qrCodeDataUrl}
              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download QR
            </button>
          </div>
          <button
            onClick={() => {
              setUrl("");
              setShowQrCode(false);
            }}
            className="absolute top-4 left-4 text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
}

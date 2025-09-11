// app/api/shorten/og-image/[shortCode]/route.tsx
import { ImageResponse } from "next/og";
import { supabase } from "@/lib/supabase";
import { config } from "@/lib/config";

export const runtime = "edge";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ shortCode: string }> }
) {
  try {
    const { shortCode } = await ctx.params;
    // Try to read the long URL, but do not fail OG generation if not found
    let longUrl: string | undefined;
    try {
      const { data } = await supabase
        .from("urls")
        .select("long_url")
        .eq("short_code", shortCode)
        .single();
      longUrl = data?.long_url;
    } catch (dbErr) {
      console.warn("OG: non-fatal DB error:", dbErr);
    }

    // Derive domain from the incoming request URL to work reliably on Edge
    const { origin } = new URL(_req.url);
    longUrl = longUrl || origin; // fallback to domain

    
    return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex", // required for OG
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #FF9966 0%, #FFEBCD 50%, #FF9966 100%)",
          position: "relative",
          overflow: "hidden",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {/* Glowing blobs */}
        <div
          style={{
            position: "absolute",
            top: "-10%",
            left: "-10%",
            width: 350,
            height: 350,
            background:
              "radial-gradient(circle, rgba(255,165,0,0.25) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(100px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-15%",
            right: "-10%",
            width: 400,
            height: 400,
            background:
              "radial-gradient(circle, rgba(255,140,0,0.2) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(120px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "30%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            height: 500,
            background:
              "radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(150px)",
          }}
        />

        {/* Content wrapper */}
        <div
          style={{
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
         <div
  style={{
    width: 300,
    height: 300,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #FFA500, #FFDD99)",
    padding: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
    position: "relative",
    marginBottom: 40,
  }}
>
  <div
    style={{
      position: "absolute",
      top: "-25px",
      left: "-25px",
      right: "-25px",
      bottom: "-25px",
      borderRadius: "50%",
      background: "radial-gradient(circle, rgba(255,165,0,0.25), transparent 70%)",
      filter: "blur(25px)",
      zIndex: -1,
    }}
  />
  <div
    style={{
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      background: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <span
      style={{
        fontSize: 120,
        fontWeight: 800,
        color: "#FF6B35",
        letterSpacing: "-2px",
      }}
    >
      L
    </span>
  </div>
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: 80,
              fontWeight: "bold",
              margin: 0,
              color: "#000",
              marginBottom: 10,
              textShadow: "2px 2px 8px rgba(0,0,0,0.2)",
            }}
          >
            Lakshya
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 40,
              margin: 0,
              letterSpacing: "3px",
              color: "#000",
              fontWeight: 500,
              opacity: 0.85,
              fontStyle: "italic",
            }}
          >
            URL SHORTENER
          </p>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );


  } catch (e) {
    console.error("OG Image generation error:", e);
    return Response.json({ error: "Failed to generate OG image" }, { status: 500 });
  }
}

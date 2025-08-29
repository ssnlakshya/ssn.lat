import { ImageResponse } from "next/og";
import { supabase } from "@/lib/supabase";

export const runtime = "edge";

export async function GET(
  request: Request,
  { params }: { params: { shortCode: string } }
) {
  const { shortCode } = params;

  const { data, error } = await supabase
    .from("urls")
    .select("long_url")
    .eq("short_code", shortCode)
    .single();

  const longUrl = data?.long_url || "https://ssn.lat";

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(to bottom right, #f9fafb, #e5e7eb)",
          width: "100%",
          height: "100%",
          padding: "60px",
          justifyContent: "center",
          fontSize: 48,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <img
            src="https://ssn.lat/lakshya.png"
            width={120}
            height={120}
            style={{ borderRadius: 20 }}
          />
          <span style={{ fontWeight: 700, color: "#111" }}>
            Lakshya URL Shortener
          </span>
        </div>

        <div
          style={{
            marginTop: 80,
            textAlign: "center",
            color: "#1f2937",
            fontWeight: 600,
            fontSize: 60,
          }}
        >
          {longUrl}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}

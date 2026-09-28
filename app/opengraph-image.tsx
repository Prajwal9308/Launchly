import { ImageResponse } from "next/og";

export const alt = "ViperByte — Web & Mobile App Development";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#ffffff", padding: 80, fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="60" height="60" viewBox="0 0 24 24">
            <rect width="24" height="24" rx="6" fill="#16181d" />
            <path d="M5 6h4.2L12 14.4 14.8 6H19l-5.9 13h-2.2Z" fill="#ea6a1f" />
            <path d="M12 14.4 14.8 6H19l-5.9 13H12Z" fill="#f7b58a" />
          </svg>
          <div style={{ fontSize: 38, fontWeight: 700, color: "#16181d", letterSpacing: -1 }}>ViperByte</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ fontSize: 66, fontWeight: 600, color: "#16181d", lineHeight: 1.08, letterSpacing: -2 }}>
            Websites, apps and digital products, built with precision.
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 28, color: "#4a4f5c" }}>
            <div style={{ width: 44, height: 4, borderRadius: 4, background: "#ea6a1f" }} />
            Web &amp; mobile app development
          </div>
        </div>
      </div>
    ),
    size,
  );
}

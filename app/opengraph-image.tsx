import { ImageResponse } from "next/og";

export const alt = "Websites built to grow your business";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#ffffff", padding: 80, fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "#2f54d9" }} />
          <div style={{ fontSize: 32, fontWeight: 600, color: "#17171c" }}>Launchly</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 72, fontWeight: 600, color: "#17171c", lineHeight: 1.05, letterSpacing: -2 }}>Websites Built to Grow Your Business</div>
          <div style={{ fontSize: 30, color: "#55555f" }}>Modern, professional websites for small businesses.</div>
        </div>
      </div>
    ),
    size,
  );
}

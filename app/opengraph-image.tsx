import { ImageResponse } from "next/og";

export const alt = "PrimeTechLabs — Web & Mobile App Development";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#ffffff", padding: 80, fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 52, height: 52, borderRadius: 13, background: "#0f1115", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 30, fontWeight: 700 }}>P</div>
          <div style={{ fontSize: 34, fontWeight: 600, color: "#0f1115" }}>PrimeTechLabs</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 68, fontWeight: 600, color: "#0f1115", lineHeight: 1.06, letterSpacing: -2 }}>Websites and mobile apps, built for your business.</div>
          <div style={{ fontSize: 30, color: "#4a4f5c" }}>Web &amp; mobile app development</div>
        </div>
      </div>
    ),
    size,
  );
}

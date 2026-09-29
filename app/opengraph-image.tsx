import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "CoreGravity — Web & Mobile App Development";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const mark = await readFile(join(process.cwd(), "public/images/brand/coregravity-mark-og.png"));
  const markSrc = `data:image/png;base64,${mark.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#ffffff", padding: 80, fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <img src={markSrc} width={60} height={60} alt="" />
          <div style={{ fontSize: 38, fontWeight: 700, color: "#16181d", letterSpacing: -1 }}>CoreGravity</div>
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

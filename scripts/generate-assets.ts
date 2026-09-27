/**
 * Generates static demo assets: portfolio preview SVGs and test fixtures.
 * Run with: npx tsx scripts/generate-assets.ts
 */
import { writeFileSync } from "node:fs";
import { wireframePng } from "./wireframe-png";

const PORTFOLIO = [
  { slug: "bella-verde", name: "Bella Verde", accent: "#7a8b3f", bg: "#f6f4ec", tagline: "Seasonal Italian kitchen" },
  { slug: "northstar-plumbing", name: "Northstar Plumbing", accent: "#1d3b5c", bg: "#eef2f6", tagline: "Reliable plumbing, done right" },
  { slug: "urban-glow", name: "Urban Glow Salon", accent: "#9b5a6b", bg: "#f8f1f2", tagline: "Hair, color & care" },
  { slug: "harbor-dental", name: "Harbor Dental", accent: "#1f7a7a", bg: "#edf6f6", tagline: "Gentle, modern dentistry" },
  { slug: "maple-olive", name: "Maple & Olive", accent: "#3f6b3a", bg: "#f0f4ee", tagline: "Landscaping & garden care" },
  { slug: "summit-electric", name: "Summit Electric", accent: "#b7791f", bg: "#fbf6ea", tagline: "Licensed residential electricians" },
];

function svg({ name, accent, bg, tagline }: (typeof PORTFOLIO)[number]) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="Inter, Arial, sans-serif">
  <rect width="800" height="500" fill="#ffffff"/>
  <rect width="800" height="56" fill="#ffffff"/>
  <rect y="56" width="800" height="1" fill="#e5e5e8"/>
  <rect x="32" y="18" width="20" height="20" rx="5" fill="${accent}"/>
  <text x="62" y="33" font-size="13" font-weight="600" fill="#17171c">${name.replace("&", "&amp;")}</text>
  <rect x="470" y="24" width="48" height="8" rx="4" fill="#d4d4d9"/>
  <rect x="534" y="24" width="48" height="8" rx="4" fill="#d4d4d9"/>
  <rect x="598" y="24" width="48" height="8" rx="4" fill="#d4d4d9"/>
  <rect x="672" y="17" width="96" height="22" rx="5" fill="${accent}"/>
  <rect y="57" width="800" height="250" fill="${bg}"/>
  <text x="48" y="130" font-size="12" font-weight="500" fill="${accent}" letter-spacing="1">${tagline.toUpperCase().replace("&", "&amp;")}</text>
  <rect x="48" y="146" width="300" height="20" rx="4" fill="#17171c"/>
  <rect x="48" y="174" width="240" height="20" rx="4" fill="#17171c"/>
  <rect x="48" y="210" width="280" height="8" rx="4" fill="#a1a1aa"/>
  <rect x="48" y="226" width="220" height="8" rx="4" fill="#a1a1aa"/>
  <rect x="48" y="252" width="112" height="30" rx="6" fill="${accent}"/>
  <rect x="170" y="252" width="96" height="30" rx="6" fill="#ffffff" stroke="#d4d4d9"/>
  <rect x="440" y="90" width="312" height="190" rx="10" fill="#ffffff"/>
  <rect x="456" y="106" width="280" height="120" rx="6" fill="${accent}" opacity="0.14"/>
  <rect x="456" y="238" width="160" height="8" rx="4" fill="#d4d4d9"/>
  <rect x="456" y="254" width="120" height="8" rx="4" fill="#e5e5e8"/>
  ${[0, 1, 2]
    .map(
      (i) => `<rect x="${48 + i * 240}" y="336" width="224" height="130" rx="8" fill="#ffffff" stroke="#e5e5e8"/>
  <rect x="${64 + i * 240}" y="352" width="28" height="28" rx="6" fill="${accent}" opacity="0.15"/>
  <rect x="${64 + i * 240}" y="394" width="120" height="9" rx="4" fill="#17171c"/>
  <rect x="${64 + i * 240}" y="412" width="170" height="7" rx="3" fill="#d4d4d9"/>
  <rect x="${64 + i * 240}" y="426" width="140" height="7" rx="3" fill="#d4d4d9"/>`,
    )
    .join("\n  ")}
</svg>
`;
}

for (const item of PORTFOLIO) {
  writeFileSync(`public/portfolio/${item.slug}.svg`, svg(item));
}
writeFileSync("tests/fixtures/homepage-design.png", wireframePng({ accent: "#2f54d9", width: 480, height: 320 }));
writeFileSync("tests/fixtures/logo.png", wireframePng({ accent: "#1d3b5c", width: 64, height: 64 }));
writeFileSync("tests/fixtures/fake-image.png", Buffer.from("this is not really a png"));
console.log("Assets generated.");

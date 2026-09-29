/**
 * Captures the public website for review: full-page screenshots at a phone and
 * a desktop width, plus a plain-text summary of each page (title, meta
 * description, headings, calls to action, links, icons and image alt text).
 *
 *   npm run review:capture                       # live site
 *   npm run review:capture -- http://localhost:3000
 *
 * Output goes to .review/<timestamp>/ (git-ignored). Used by the
 * marketing-reviewer agent in .claude/agents/.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { chromium, type Page } from "@playwright/test";

const BASE = (process.argv[2] ?? "https://coregravity.io").replace(/\/$/, "");
const PAGES = ["/", "/services", "/solutions", "/portfolio", "/process", "/pricing", "/about", "/faq", "/contact", "/start-project", "/privacy", "/terms", "/login", "/signup"];
const WIDTHS = { mobile: 390, desktop: 1440 } as const;

const outDir = path.join(".review", new Date().toISOString().replace(/[:.]/g, "-"));
mkdirSync(outDir, { recursive: true });

/** Scroll through the page so scroll-triggered reveals have run before capturing. */
async function revealAll(page: Page) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 500) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(50);
  }
  await page.waitForTimeout(600);
  await page.evaluate(() => window.scrollTo(0, 0));
}

function slug(route: string) {
  return route === "/" ? "home" : route.slice(1).replace(/\//g, "-");
}

async function summarize(page: Page) {
  return page.evaluate(() => {
    const text = (el: Element) => (el.textContent ?? "").replace(/\s+/g, " ").trim();
    const main = document.querySelector("main") ?? document.body;
    return {
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.getAttribute("content") ?? "(none)",
      headings: [...document.querySelectorAll("h1, h2, h3")].map((h) => `${h.tagName.toLowerCase()}: ${text(h)}`),
      actions: [...main.querySelectorAll("a, button")]
        .map((el) => `${el.tagName === "A" ? "link" : "button"}: ${text(el) || el.getAttribute("aria-label") || "(no label)"}${el instanceof HTMLAnchorElement ? ` → ${el.getAttribute("href")}` : ""}`)
        .filter((v, i, all) => all.indexOf(v) === i),
      icons: [...new Set([...document.querySelectorAll("svg.lucide")].map((s) => [...s.classList].find((c) => c.startsWith("lucide-")) ?? "lucide"))],
      images: [...document.images].map((img) => `${img.getAttribute("alt") || "(no alt)"} — ${img.naturalWidth}x${img.naturalHeight}`),
      bodyText: text(main),
    };
  });
}

async function main() {
  const browser = await chromium.launch();
  const report: string[] = [`# Site capture\n\nSource: ${BASE}\nCaptured: ${new Date().toISOString()}\n`];

  for (const [label, width] of Object.entries(WIDTHS)) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    // tsx wraps named functions in a __name() helper that doesn't exist in the browser.
    await page.addInitScript("window.__name = (fn) => fn");
    const errors: string[] = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    page.on("pageerror", (e) => errors.push(e.message));

    for (const route of PAGES) {
      let response;
      try {
        response = await page.goto(BASE + route, { waitUntil: "load", timeout: 45_000 });
        await page.waitForLoadState("networkidle", { timeout: 5_000 }).catch(() => {});
        await revealAll(page);
      } catch (error) {
        report.push(`> Failed to load ${route} at ${width}px: ${(error as Error).message.split("\n")[0]}`);
        continue;
      }
      const file = `${slug(route)}-${label}.png`;
      await page.screenshot({ path: path.join(outDir, file), fullPage: true });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);

      if (label === "desktop") {
        const s = await summarize(page);
        report.push(
          `## ${route} (HTTP ${response?.status()})`,
          `Screenshots: ${slug(route)}-desktop.png, ${slug(route)}-mobile.png`,
          `Title: ${s.title}`,
          `Meta description: ${s.description}`,
          `\n### Headings\n${s.headings.map((h) => `- ${h}`).join("\n")}`,
          `\n### Links and buttons\n${s.actions.map((a) => `- ${a}`).join("\n")}`,
          `\n### Icons\n${s.icons.join(", ") || "(none)"}`,
          `\n### Images\n${s.images.map((i) => `- ${i}`).join("\n") || "(none)"}`,
          `\n### Page text\n${s.bodyText}\n`,
        );
      }
      if (overflow) report.push(`> Horizontal overflow on ${route} at ${width}px`);
    }
    if (errors.length) report.push(`> Console errors at ${width}px:\n${errors.map((e) => `> - ${e}`).join("\n")}`);
    await page.close();
  }

  await browser.close();
  writeFileSync(path.join(outDir, "summary.md"), report.join("\n"));
  console.log(`Captured ${PAGES.length} pages to ${outDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

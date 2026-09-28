import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

const ROUTES = ["", "/services", "/solutions", "/process", "/about", "/contact", "/pricing", "/faq", "/privacy", "/terms"];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((path) => ({
    url: `${siteConfig.url}${path}`,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/privacy" || path === "/terms" ? 0.3 : 0.7,
  }));
}

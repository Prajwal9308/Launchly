import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/dashboard", "/start-project/", "/api/", "/login", "/signup", "/post-login"] }],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}

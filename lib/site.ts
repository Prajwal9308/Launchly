/** Static site constants. Editable studio details live in SiteSettings (admin → Settings). */
export const siteConfig = {
  url: process.env.APP_URL ?? "http://localhost:3000",
  defaultTitle: "Launchly — Websites built to grow your business",
  defaultDescription:
    "We design and build modern, professional websites that help businesses attract customers, communicate their value, and grow online.",
};

/** Brand constants. Editable contact details live in SiteSettings (Admin → Settings). */
export const BRAND = "CoreGravity";

/** The seeded contact address; never show it to visitors as if it were real. */
export function isPlaceholderEmail(email: string) {
  return /@example\.(com|org|net)$/i.test(email);
}

export const siteConfig = {
  url: process.env.APP_URL ?? "http://localhost:3000",
  defaultTitle: "CoreGravity — Websites & Digital Solutions for Small Businesses",
  defaultDescription:
    "CoreGravity designs and develops professional websites, online stores, booking systems and business applications for small businesses and independent vendors.",
};

/** Brand constants. Editable contact details live in SiteSettings (Admin → Settings). */
export const BRAND = "PrimeTechLabs";

/** The seeded contact address; never show it to visitors as if it were real. */
export function isPlaceholderEmail(email: string) {
  return /@example\.(com|org|net)$/i.test(email);
}

export const siteConfig = {
  url: process.env.APP_URL ?? "http://localhost:3000",
  defaultTitle: "PrimeTechLabs — Web & Mobile App Development",
  defaultDescription:
    "PrimeTechLabs designs and develops professional websites, web applications and mobile apps for businesses and entrepreneurs.",
};

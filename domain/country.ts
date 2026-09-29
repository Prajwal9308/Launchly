/**
 * The two countries CoreGravity serves. The country decides the currency,
 * budget ranges and tax wording a customer sees. Browser-safe.
 */

export const COUNTRIES = ["CA", "IN"] as const;
export type CountryCode = (typeof COUNTRIES)[number];

export const COUNTRY_INFO: Record<CountryCode, { name: string; currency: "CAD" | "INR"; symbol: string; numberLocale: string }> = {
  CA: { name: "Canada", currency: "CAD", symbol: "CA$", numberLocale: "en-CA" },
  IN: { name: "India", currency: "INR", symbol: "₹", numberLocale: "en-IN" },
};

/** Cookie holding the visitor's manual choice. It always wins over detection. */
export const COUNTRY_COOKIE = "cg_country";

export const SERVED_COUNTRIES_NOTE = "CoreGravity currently serves customers in Canada and India.";

export function isCountry(value: unknown): value is CountryCode {
  return typeof value === "string" && (COUNTRIES as readonly string[]).includes(value);
}

/** "Canada · CAD" */
export function countryLabel(country: CountryCode) {
  const info = COUNTRY_INFO[country];
  return `${info.name} · ${info.currency}`;
}

export function countryName(country: CountryCode | null | undefined) {
  return country ? COUNTRY_INFO[country].name : "Not set";
}

/**
 * Formats a whole-unit amount in the country's currency: "CA$1,500" for
 * Canada and "₹1,50,000" (Indian digit grouping) for India. The symbol is
 * written explicitly so Canadian prices never show a bare "$".
 */
export function formatMoney(amount: number, country: CountryCode) {
  const info = COUNTRY_INFO[country];
  return `${info.symbol}${new Intl.NumberFormat(info.numberLocale, { maximumFractionDigits: 0 }).format(amount)}`;
}

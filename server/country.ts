import "server-only";
import { cookies, headers } from "next/headers";
import { COUNTRY_COOKIE, isCountry, type CountryCode } from "@/domain/country";

/**
 * The visitor's country for pricing and currency. A manual choice (cookie)
 * always wins; otherwise the hosting platform's IP country header is used
 * only when it is one of the served countries. Anything else returns null,
 * so a visitor from elsewhere is asked to choose rather than silently being
 * shown another country's prices.
 */
export async function getVisitorCountry(): Promise<CountryCode | null> {
  const chosen = (await cookies()).get(COUNTRY_COOKIE)?.value;
  if (isCountry(chosen)) return chosen;
  const h = await headers();
  const detected = (h.get("x-vercel-ip-country") ?? h.get("cf-ipcountry") ?? "").toUpperCase();
  return isCountry(detected) ? detected : null;
}

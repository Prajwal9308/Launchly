import "server-only";
import { formatDate } from "@/lib/format";
import { isPlaceholderEmail } from "@/lib/site";
import { getAIProvider } from "@/providers/ai";
import { getSiteSettings } from "@/services/catalog";
import { googleEnabled } from "./auth";

/**
 * Facts the Privacy Policy and Terms of Use depend on. Everything comes from
 * Admin → Settings or the deployment's configuration, so the legal pages
 * never name an entity, address or provider that isn't real. Unset values are
 * null and the pages leave them out.
 */
export async function getLegalContext() {
  const settings = await getSiteSettings();
  const ai = getAIProvider();
  const emailProvider = process.env.EMAIL_PROVIDER === "resend" && process.env.RESEND_API_KEY ? "Resend" : null;
  const storageProvider = process.env.STORAGE_PROVIDER === "vercel-blob" ? "Vercel Blob" : null;
  const hostingProvider = process.env.VERCEL ? "Vercel" : null;
  const contactEmail = isPlaceholderEmail(settings.contactEmail) ? null : settings.contactEmail;

  return {
    brand: settings.businessName,
    /** Legal name when configured, otherwise the trading name. */
    entity: settings.legalName || settings.businessName,
    address: settings.businessAddress,
    jurisdiction: settings.governingJurisdiction,
    contactEmail,
    privacyEmail: settings.privacyContactEmail || contactEmail,
    effectiveDate: settings.legalEffectiveDate ? formatDate(settings.legalEffectiveDate) : null,
    providers: {
      hosting: hostingProvider,
      storage: storageProvider,
      email: emailProvider,
      google: googleEnabled,
      ai: ai ? { name: ai.name.charAt(0).toUpperCase() + ai.name.slice(1) } : null,
    },
  };
}

export type LegalContext = Awaited<ReturnType<typeof getLegalContext>>;

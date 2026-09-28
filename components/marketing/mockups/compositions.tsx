import { cn } from "@/lib/utils";
import { BrowserWindow, ConceptVisual, Laptop, Monitor, Phone, Tablet } from "./devices";
import {
  AppInboxScreen,
  BookingAppScreen,
  DashboardScreen,
  DesignScreen,
  OperationsScreen,
  PortalScreen,
  ProductScreen,
  StoreScreen,
  WebsiteMobileScreen,
  WebsiteScreen,
} from "./screens";

/**
 * Device compositions used across the marketing site. One stage style
 * (canvas, faint grid, soft glow) so every preview belongs to the same visual
 * language. All of them are concept examples, never client work.
 */

type Kind = "web" | "mobile" | "design" | "ecommerce" | "operations" | "webapp";

/** Service icon keys (stored on Service.icon) → which concept to show. */
const SERVICE_KIND: Record<string, Kind> = {
  monitor: "web",
  globe: "web",
  layout: "web",
  smartphone: "mobile",
  "monitor-smartphone": "mobile",
  "pen-tool": "design",
  palette: "design",
  "shopping-cart": "ecommerce",
  workflow: "operations",
  "briefcase-business": "operations",
  building: "operations",
  "layout-dashboard": "webapp",
  code: "webapp",
};

const LABELS: Record<Kind, string> = {
  web: "an example business website shown in a browser and on a phone",
  mobile: "an example booking app shown on two phones",
  design: "an example interface being designed in a design tool",
  ecommerce: "an example online store shown on a tablet and a phone",
  operations: "an example scheduling tool for a business team",
  webapp: "an example web application dashboard",
};

/** The shared backdrop: canvas, a faint grid that fades out, and a soft accent glow. */
export function Stage({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("relative isolate overflow-hidden bg-canvas", className)}>
      <div aria-hidden className="absolute inset-0 -z-10 bg-glow" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-grid opacity-35" />
      {children}
    </div>
  );
}

/**
 * Miniature preview for a service card. Devices sit low in the stage and bleed
 * off the bottom edge, and rise slightly when the card (a `group`) is hovered.
 */
export function ServicePreview({ icon, className }: { icon: string; className?: string }) {
  const kind = SERVICE_KIND[icon] ?? "web";
  const rise = "transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:-translate-y-1.5 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0";
  return (
    <Stage className={cn("h-52 sm:h-56", className)}>
      <ConceptVisual label={LABELS[kind]} className="absolute inset-0">
        {kind === "web" && (
          <div className={cn("absolute inset-x-[9%] top-[14%]", rise)}>
            <BrowserWindow>
              <WebsiteScreen />
            </BrowserWindow>
            <Phone className="absolute right-[-5%] top-[24%] w-[19%]">
              <WebsiteMobileScreen />
            </Phone>
          </div>
        )}
        {kind === "mobile" && (
          <div className={cn("absolute inset-x-0 top-[12%] flex justify-center gap-[5%]", rise)}>
            <Phone className="w-[26%] max-w-[9.5rem]">
              <BookingAppScreen />
            </Phone>
            <Phone className="mt-[6%] w-[26%] max-w-[9.5rem]">
              <AppInboxScreen />
            </Phone>
          </div>
        )}
        {kind === "design" && (
          <div className={cn("absolute inset-x-[9%] top-[14%]", rise)}>
            <BrowserWindow url="Homepage · Design">
              <DesignScreen />
            </BrowserWindow>
          </div>
        )}
        {kind === "ecommerce" && (
          <div className={cn("absolute inset-x-[7%] top-[13%]", rise)}>
            <Tablet className="w-[84%]">
              <StoreScreen columns={3} />
            </Tablet>
            <Phone className="absolute -bottom-[20%] right-0 w-[24%]">
              <ProductScreen />
            </Phone>
          </div>
        )}
        {(kind === "operations" || kind === "webapp") && (
          <div className={cn("absolute inset-x-[9%] top-[14%]", rise)}>
            <BrowserWindow url="app.yourbrand.com">{kind === "operations" ? <OperationsScreen /> : <DashboardScreen />}</BrowserWindow>
          </div>
        )}
      </ConceptVisual>
    </Stage>
  );
}

/** Larger compositions for the "What we build" categories. */
export function SolutionShowcase({ slug, className }: { slug: string; className?: string }) {
  return (
    <Stage className={cn("flex aspect-[16/11] items-end justify-center px-[6%] pt-[8%]", className)}>
      {slug === "business-websites" && (
        <ConceptVisual label="an example business website on a laptop and a phone" className="relative w-full max-w-[34rem]">
          <Laptop>
            <WebsiteScreen />
          </Laptop>
          <Phone className="absolute bottom-[4%] right-[-2%] w-[19%]">
            <WebsiteMobileScreen />
          </Phone>
        </ConceptVisual>
      )}
      {slug === "web-applications" && (
        <ConceptVisual label="an example scheduling web application in a browser" className="mb-[6%] w-full max-w-[32rem]">
          <BrowserWindow url="app.yourbrand.com">
            <OperationsScreen />
          </BrowserWindow>
        </ConceptVisual>
      )}
      {slug === "business-dashboards" && (
        <ConceptVisual label="an example business dashboard on a desktop display" className="w-full max-w-[30rem]">
          <Monitor>
            <DashboardScreen />
          </Monitor>
        </ConceptVisual>
      )}
      {slug === "mobile-applications" && (
        <ConceptVisual label="an example booking app shown on two phones" className="flex w-full items-end justify-center gap-[6%] pb-[4%]">
          <Phone className="w-[27%] max-w-[10rem]">
            <BookingAppScreen />
          </Phone>
          <Phone className="mb-[5%] w-[27%] max-w-[10rem]">
            <AppInboxScreen />
          </Phone>
        </ConceptVisual>
      )}
      {slug === "ecommerce" && (
        <ConceptVisual label="ShopNext, an example online store, on a tablet and a phone" className="relative mb-[5%] w-full max-w-[32rem]">
          <Tablet className="w-[86%]">
            <StoreScreen columns={3} />
          </Tablet>
          <Phone className="absolute -bottom-[3%] right-0 w-[22%]">
            <ProductScreen />
          </Phone>
        </ConceptVisual>
      )}
    </Stage>
  );
}

/**
 * The ViperByte client portal — a real feature of the service, shown in a
 * simplified form (sample project, not a client's data).
 */
export function PortalPreview({ className }: { className?: string }) {
  return (
    <Stage className={cn("rounded-2xl border border-border px-[7%] py-[7%]", className)}>
      <ConceptVisual label="a simplified view of the ViperByte client portal, showing project progress and a design ready for review">
        <BrowserWindow url="Your project portal">
          <PortalScreen />
        </BrowserWindow>
      </ConceptVisual>
    </Stage>
  );
}

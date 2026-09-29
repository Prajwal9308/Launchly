import Image, { type StaticImageData } from "next/image";
import customSolutionsPhoto from "@/public/images/solutions/custom-solutions.webp";
import ecommercePhoto from "@/public/images/solutions/ecommerce.webp";
import mobileApplicationsPhoto from "@/public/images/solutions/mobile-applications.webp";
import uiUxDesignPhoto from "@/public/images/solutions/ui-ux-design.webp";
import webApplicationsPhoto from "@/public/images/solutions/web-applications.webp";
import { cn } from "@/lib/utils";
import { ConceptVisual, Laptop, Monitor, Phone, Tablet } from "./devices";
import {
  AppInboxScreen,
  BookingAppScreen,
  DashboardScreen,
  DesignScreen,
  OperationsScreen,
  OrdersScreen,
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

type Kind = "web" | "mobile" | "design" | "ecommerce" | "operations" | "webapp" | "custom";

/** Service icon keys (stored on Service.icon) → which concept to show. */
const SERVICE_KIND: Record<string, Kind> = {
  // Web Development: its features are web apps, portals and dashboards.
  monitor: "operations",
  globe: "web",
  layout: "web",
  smartphone: "mobile",
  "monitor-smartphone": "mobile",
  "pen-tool": "design",
  palette: "design",
  "shopping-cart": "ecommerce",
  workflow: "operations",
  "briefcase-business": "custom",
  building: "custom",
  "layout-dashboard": "webapp",
  code: "webapp",
};

/** Solution slugs (content/solutions.ts) → which concept to show. */
const SOLUTION_KIND: Record<string, Kind> = {
  "business-websites": "web",
  "web-applications": "operations",
  "mobile-applications": "mobile",
  ecommerce: "ecommerce",
  "business-dashboards": "webapp",
  "custom-solutions": "custom",
};

const LABELS: Record<Kind, string> = {
  web: "an example business website on a laptop and a phone",
  mobile: "an example fitness app shown on two phones on a desk",
  design: "an example travel booking website on a desktop display",
  ecommerce: "an example online store on a laptop and a phone",
  operations: "an example scheduling web application on a laptop",
  webapp: "an example business dashboard on a desktop display",
  custom: "an example analytics dashboard on a tablet",
};

/**
 * Photographed concept scenes. Kinds listed here show the photo; the others
 * fall back to the drawn device scene.
 */
const PHOTOS: Partial<Record<Kind, StaticImageData>> = {
  operations: webApplicationsPhoto,
  mobile: mobileApplicationsPhoto,
  design: uiUxDesignPhoto,
  ecommerce: ecommercePhoto,
  custom: customSolutionsPhoto,
};

/** Fills the stage with the kind's photo, rising slightly on card hover like the drawn scenes. */
function Photo({ kind, sizes }: { kind: Kind; sizes: string }) {
  const photo = PHOTOS[kind];
  if (!photo) return null;
  return (
    <ConceptVisual label={LABELS[kind]} className="absolute inset-0">
      <Image
        src={photo}
        alt=""
        fill
        sizes={sizes}
        className="object-cover transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
      />
    </ConceptVisual>
  );
}

/**
 * Width of each scene. The stage is a size container, so every scene is capped
 * by both the stage's width (cqw) and its height (cqh), taking about 80% of the
 * height: the whole device always fits, whatever the stage's shape, with no
 * cropped bases or stands.
 */
const SCENE_WIDTH: Record<Kind, string> = {
  web: "w-[min(88cqw,146cqh)]",
  operations: "w-[min(84cqw,135cqh)]",
  design: "w-[min(80cqw,126cqh)]",
  webapp: "w-[min(80cqw,126cqh)]",
  ecommerce: "w-[min(86cqw,109cqh)]",
  custom: "w-[min(78cqw,99cqh)]",
  mobile: "w-[min(56cqw,76cqh)]",
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

/** One concept scene: complete devices, resting on a soft floor shadow. */
function Scene({ kind, className }: { kind: Kind; className?: string }) {
  return (
    <div className={cn("relative", SCENE_WIDTH[kind], className)}>
      <span aria-hidden className="absolute -bottom-[2%] left-[8%] right-[8%] h-[6%] rounded-[50%] bg-black/10 blur-md" />
      {kind === "web" && (
        <>
          <Laptop className="w-[92%]">
            <WebsiteScreen />
          </Laptop>
          <Phone className="absolute bottom-0 right-0 w-[18%]">
            <WebsiteMobileScreen />
          </Phone>
        </>
      )}
      {kind === "operations" && (
        <Laptop>
          <OperationsScreen />
        </Laptop>
      )}
      {kind === "design" && (
        <Monitor>
          <DesignScreen />
        </Monitor>
      )}
      {kind === "webapp" && (
        <Monitor>
          <DashboardScreen />
        </Monitor>
      )}
      {kind === "ecommerce" && (
        <>
          <Tablet className="mb-[4%] w-[86%]">
            <StoreScreen columns={3} />
          </Tablet>
          <Phone className="absolute bottom-0 right-0 w-[22%]">
            <ProductScreen />
          </Phone>
        </>
      )}
      {kind === "custom" && (
        <Tablet>
          <OrdersScreen />
        </Tablet>
      )}
      {kind === "mobile" && (
        <div className="flex items-end justify-center gap-[8%]">
          <Phone className="mb-[9%] w-[44%]">
            <BookingAppScreen />
          </Phone>
          <Phone className="w-[44%]">
            <AppInboxScreen />
          </Phone>
        </div>
      )}
    </div>
  );
}

/**
 * Preview for a service card. The devices rise slightly when the card (a
 * `group`) is hovered or focused; nothing moves for reduced-motion visitors.
 */
export function ServicePreview({ icon, className }: { icon: string; className?: string }) {
  const kind = SERVICE_KIND[icon] ?? "web";
  return (
    <Stage className={cn("@container-size aspect-[16/10]", className)}>
      {PHOTOS[kind] ? (
        <Photo kind={kind} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
      ) : (
        <ConceptVisual label={LABELS[kind]} className="absolute inset-0 flex items-center justify-center">
          <Scene
            kind={kind}
            className="transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:-translate-y-1 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0"
          />
        </ConceptVisual>
      )}
    </Stage>
  );
}

/** Larger showcase for a "What we build" category. */
export function SolutionShowcase({ slug, className }: { slug: string; className?: string }) {
  const kind = SOLUTION_KIND[slug] ?? "web";
  return (
    <Stage className={cn("@container-size aspect-[16/11]", className)}>
      {PHOTOS[kind] ? (
        <Photo kind={kind} sizes="(min-width: 1024px) 50vw, 100vw" />
      ) : (
        <ConceptVisual label={LABELS[kind]} className="absolute inset-0 flex items-center justify-center">
          <Scene kind={kind} />
        </ConceptVisual>
      )}
    </Stage>
  );
}

/**
 * The CoreGravity client portal — a real feature of the service, shown in a
 * simplified form (sample project, not a client's data).
 */
export function PortalPreview({ className }: { className?: string }) {
  return (
    <Stage className={cn("@container-size aspect-[16/11] rounded-2xl border border-border", className)}>
      <ConceptVisual
        label="a simplified view of the CoreGravity client portal on a laptop, showing project progress and a design ready for review"
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="relative w-[min(86cqw,135cqh)]">
          <span aria-hidden className="absolute -bottom-[2%] left-[8%] right-[8%] h-[6%] rounded-[50%] bg-black/10 blur-md" />
          <Laptop>
            <PortalScreen />
          </Laptop>
        </div>
      </ConceptVisual>
    </Stage>
  );
}

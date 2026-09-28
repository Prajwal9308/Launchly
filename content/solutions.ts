/**
 * "What We Build" — categories of work PrimeTechLabs offers. These are
 * capabilities, not completed client projects.
 */
export const SOLUTIONS = [
  {
    slug: "business-websites",
    title: "Business Websites",
    icon: "monitor",
    description: "Professional, responsive websites designed to establish credibility and generate inquiries.",
    examples: ["Company websites", "Landing pages", "Service & booking sites", "Website redesigns"],
  },
  {
    slug: "web-applications",
    title: "Web Applications",
    icon: "layout-dashboard",
    description: "Custom dashboards, portals, booking systems, internal tools and other browser-based products.",
    examples: ["Client portals", "Admin dashboards", "Booking systems", "Internal tools"],
  },
  {
    slug: "mobile-applications",
    title: "Mobile Applications",
    icon: "smartphone",
    description: "iOS and Android apps for customer-facing or internal business use, built cross-platform or native.",
    examples: ["Customer apps", "Internal team apps", "MVPs & prototypes", "Companion apps"],
  },
  {
    slug: "ecommerce",
    title: "E-commerce",
    icon: "shopping-cart",
    description: "Online stores with product management, checkout, payments and a responsive shopping experience.",
    examples: ["Online stores", "Product catalogs", "Checkout & payments", "Order management"],
  },
] as const;

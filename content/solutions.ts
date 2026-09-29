/**
 * "What We Build" — categories of work ViperByte offers. These are
 * capabilities, not completed client projects.
 */
export const SOLUTIONS = [
  {
    slug: "business-websites",
    title: "Business Websites",
    icon: "globe",
    description: "Professional, responsive websites designed to establish credibility and generate inquiries.",
    examples: ["Company websites", "Landing pages", "Service & booking sites", "Website redesigns"],
  },
  {
    slug: "web-applications",
    title: "Web Applications",
    icon: "layout",
    description: "Portals, booking systems, internal tools and other browser-based products built around how your team works.",
    examples: ["Client portals", "Booking systems", "Membership platforms", "Online tools"],
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
  {
    slug: "business-dashboards",
    title: "Business Dashboards",
    icon: "layout-dashboard",
    description: "Clear reporting and operations dashboards that bring your sales, bookings and team data into one place.",
    examples: ["Sales & KPI reporting", "Operations overviews", "Admin panels", "Data integrations"],
  },
  {
    slug: "custom-solutions",
    title: "Custom Solutions",
    icon: "briefcase-business",
    description: "Internal systems, integrations and automation for the parts of your business that off-the-shelf software doesn't fit.",
    examples: ["Order & job tracking", "Inventory management", "System integrations", "Process automation"],
  },
] as const;

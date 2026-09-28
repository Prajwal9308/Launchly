/**
 * Default public-site catalog: the studio's services, pricing packages (no
 * prices; the owner sets them in admin) and SAMPLE portfolio concepts. Sample
 * items are never shown publicly — the portfolio only lists real projects. Used by the dev seed and by the
 * one-time production bootstrap (prisma/bootstrap.ts).
 */
export const SERVICES = [
  { slug: "web-development", name: "Web Development", icon: "monitor", summary: "Responsive websites and custom web applications, from business sites to dashboards and portals.", features: ["Business & landing pages", "Custom web applications", "Client portals & dashboards", "Responsive on every device"] },
  { slug: "mobile-app-development", name: "Mobile App Development", icon: "smartphone", summary: "iOS, Android and cross-platform apps for customers or internal teams.", features: ["iOS & Android", "Cross-platform apps", "MVPs & prototypes", "App store release"] },
  { slug: "ui-ux-design", name: "UI/UX Design", icon: "pen-tool", summary: "Clean, intuitive interfaces designed around how people actually use your product.", features: ["User flows & wireframes", "Interface design", "Design systems", "Usability review"] },
  { slug: "ecommerce-development", name: "E-commerce Development", icon: "shopping-cart", summary: "Online stores and commerce experiences with secure checkout and product management.", features: ["Online stores", "Checkout & payments", "Product management"] },
  { slug: "business-solutions", name: "Custom Business Solutions", icon: "briefcase-business", summary: "Booking systems, internal tools and integrations built around how your business runs.", features: ["Booking & scheduling", "Internal tools", "Integrations & automation"] },
];

export const PACKAGES = [
  { name: "Website", description: "A professional, responsive website for your business.", features: ["Custom design", "Mobile-friendly", "Contact & inquiry forms", "Launch support"], highlighted: false },
  { name: "Web Application", description: "A custom browser-based product such as a portal, dashboard or booking system.", features: ["User accounts", "Custom features", "Admin tools", "Hosting setup"], highlighted: true },
  { name: "Mobile App", description: "An iOS and Android app for your customers or team.", features: ["iOS & Android", "App store release", "Backend & APIs", "Post-launch support"], highlighted: false },
  { name: "Custom Project", description: "For larger or unusual projects that need a tailored plan.", features: ["Custom scope", "Integrations", "Phased delivery"], highlighted: false },
];

export const PORTFOLIO = [
  { slug: "bella-verde-concept", title: "Bella Verde — Restaurant website", industry: "Restaurant", image: "bella-verde", services: ["Website Design", "Business Websites"], featured: true, description: "A menu-first restaurant concept with reservations, hours and location up front." },
  { slug: "northstar-plumbing-concept", title: "Northstar Plumbing — Service website", industry: "Plumbing", image: "northstar-plumbing", services: ["Business Websites", "SEO Foundations"], featured: true, description: "A trades website built around quote requests, service areas and click-to-call on mobile." },
  { slug: "urban-glow-concept", title: "Urban Glow — Salon website", industry: "Salon", image: "urban-glow", services: ["Website Design", "Landing Pages"], featured: true, description: "A calm, image-led salon concept with services, pricing and online booking." },
  { slug: "harbor-dental-concept", title: "Harbor Dental — Practice website", industry: "Dental", image: "harbor-dental", services: ["Website Redesign", "SEO Foundations"], featured: false, description: "A reassuring dental practice concept focused on new-patient information and appointments." },
  { slug: "maple-olive-concept", title: "Maple & Olive — Landscaping website", industry: "Landscaping", image: "maple-olive", services: ["Business Websites", "Website Development"], featured: false, description: "A project gallery and seasonal services layout for a landscaping company." },
  { slug: "summit-electric-concept", title: "Summit Electric — Contractor website", industry: "Electrical", image: "summit-electric", services: ["Landing Pages", "Website Design"], featured: false, description: "A straightforward contractor concept emphasizing licensing, service list and fast contact." },
];


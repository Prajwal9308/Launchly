/**
 * Default public-site catalog: the studio's services, pricing packages (no
 * prices; the owner sets them in admin) and SAMPLE portfolio concepts, which
 * are always labelled as samples on the site. Used by the dev seed and by the
 * one-time production bootstrap (prisma/bootstrap.ts).
 */
export const SERVICES = [
  { slug: "website-design", name: "Website Design", icon: "palette", summary: "Clean, modern designs built around your brand and the customers you want to reach.", features: ["Custom page layouts", "Mobile-first design", "Brand-aligned typography and color", "Design review in your portal"] },
  { slug: "website-development", name: "Website Development", icon: "code", summary: "Fast, reliable websites built with modern tools and tested across devices.", features: ["Responsive build", "Performance optimization", "Accessible markup", "Cross-browser testing"] },
  { slug: "landing-pages", name: "Landing Pages", icon: "layout", summary: "Focused single pages for a campaign, offer or new service.", features: ["Clear single call to action", "Lead capture form", "Fast turnaround"] },
  { slug: "business-websites", name: "Business Websites", icon: "building", summary: "Complete multi-page websites for established local and service businesses.", features: ["Home, about, services and contact pages", "Service area and hours", "Google Maps and click-to-call"] },
  { slug: "ecommerce-websites", name: "E-commerce Websites", icon: "shopping-cart", summary: "Online stores with product catalogs, secure checkout and order management.", features: ["Product catalog setup", "Checkout and payment configuration", "Order flow testing"] },
  { slug: "website-redesign", name: "Website Redesign", icon: "refresh", summary: "Modernize an outdated website while keeping what already works.", features: ["Review of your current site", "Updated structure and design", "Content migration"] },
  { slug: "seo-foundations", name: "SEO Foundations", icon: "search", summary: "Technical and on-page foundations that help search engines understand your site.", features: ["Page titles and descriptions", "Structured data and sitemap", "Performance and mobile checks"] },
  { slug: "website-maintenance", name: "Website Maintenance", icon: "wrench", summary: "Ongoing updates, monitoring and fixes so your website stays in good shape.", features: ["Software and plugin updates", "Uptime monitoring", "Small fixes and changes"] },
  { slug: "content-updates", name: "Content Updates", icon: "file-text", summary: "Keep menus, prices, photos and service details current.", features: ["Text and image updates", "New pages and sections", "Seasonal changes"] },
  { slug: "digital-marketing-support", name: "Digital Marketing Support", icon: "megaphone", summary: "Practical help with your online presence beyond the website.", features: ["Google Business Profile setup", "Social media links and sharing", "Email signup integration"] },
];

export const PACKAGES = [
  { name: "Starter Website", description: "A focused website for a new or small business.", features: ["Up to 3 pages", "Mobile-friendly design", "Contact form", "Basic SEO setup"], highlighted: false },
  { name: "Business Website", description: "A complete website for an established local business.", features: ["Up to 8 pages", "Custom design", "Service pages", "Maps and click-to-call", "SEO foundations"], highlighted: true },
  { name: "Premium Website", description: "Advanced design and functionality for growing businesses.", features: ["Up to 15 pages", "Booking or e-commerce integration", "Blog setup", "Analytics setup"], highlighted: false },
  { name: "Custom Website", description: "For larger or unusual projects that need a tailored plan.", features: ["Custom scope", "Third-party integrations", "Phased delivery"], highlighted: false },
];

export const PORTFOLIO = [
  { slug: "bella-verde-concept", title: "Bella Verde — Restaurant website", industry: "Restaurant", image: "bella-verde", services: ["Website Design", "Business Websites"], featured: true, description: "A menu-first restaurant concept with reservations, hours and location up front." },
  { slug: "northstar-plumbing-concept", title: "Northstar Plumbing — Service website", industry: "Plumbing", image: "northstar-plumbing", services: ["Business Websites", "SEO Foundations"], featured: true, description: "A trades website built around quote requests, service areas and click-to-call on mobile." },
  { slug: "urban-glow-concept", title: "Urban Glow — Salon website", industry: "Salon", image: "urban-glow", services: ["Website Design", "Landing Pages"], featured: true, description: "A calm, image-led salon concept with services, pricing and online booking." },
  { slug: "harbor-dental-concept", title: "Harbor Dental — Practice website", industry: "Dental", image: "harbor-dental", services: ["Website Redesign", "SEO Foundations"], featured: false, description: "A reassuring dental practice concept focused on new-patient information and appointments." },
  { slug: "maple-olive-concept", title: "Maple & Olive — Landscaping website", industry: "Landscaping", image: "maple-olive", services: ["Business Websites", "Website Development"], featured: false, description: "A project gallery and seasonal services layout for a landscaping company." },
  { slug: "summit-electric-concept", title: "Summit Electric — Contractor website", industry: "Electrical", image: "summit-electric", services: ["Landing Pages", "Website Design"], featured: false, description: "A straightforward contractor concept emphasizing licensing, service list and fast contact." },
];


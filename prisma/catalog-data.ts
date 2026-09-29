/**
 * Default public-site catalog: the studio's services, pricing packages (no
 * prices; the owner sets them in admin) and SAMPLE portfolio concepts. Sample
 * items are never shown publicly — the portfolio only lists real projects. Used by the dev seed and by the
 * one-time production bootstrap (prisma/bootstrap.ts).
 */
export const SERVICES = [
  { slug: "web-development", name: "Website Development", icon: "globe", summary: "Professional, responsive websites designed around your business and customers.", description: "A clear, well-organized website that explains what you offer, works on every screen size and makes it easy for customers to contact you.", features: ["Business websites", "Landing pages", "Website redesigns", "Mobile-responsive layouts"] },
  { slug: "ecommerce-development", name: "E-commerce Development", icon: "shopping-cart", summary: "Online stores with product management, checkout, payments and order management.", description: "Sell products or services online with a store that is straightforward for customers to use and for your team to manage.", features: ["Online stores", "Product catalogs", "Checkout & payments", "Order management"] },
  { slug: "booking-systems", name: "Booking & Appointment Systems", icon: "calendar-check", summary: "Online scheduling solutions that make it easier for customers to book your services.", description: "Let customers see what you offer, choose a time and book online, while your team manages appointments in one place.", features: ["Appointment scheduling", "Service listings", "Booking management", "Customer notifications"] },
  { slug: "business-solutions", name: "Business Applications", icon: "layout-dashboard", summary: "Custom dashboards, portals and internal tools designed around your workflow.", description: "Software built around the way your business already operates, so your team spends less time on manual work.", features: ["Dashboards & reporting", "Customer & staff portals", "Internal tools", "Integrations & automation"] },
  { slug: "mobile-app-development", name: "Mobile App Development", icon: "smartphone", summary: "iOS and Android applications for businesses that need a dedicated mobile experience.", description: "Mobile applications for your customers or your team, planned around what people need to do on their phones.", features: ["iOS & Android", "Customer & staff apps", "Backend & API integration", "App store preparation"] },
  { slug: "ui-ux-design", name: "UI/UX Design", icon: "pen-tool", summary: "Clear, professional interfaces designed to make websites and applications easy to use.", description: "Layouts and user journeys designed around your customers, so they can find information and complete tasks without confusion.", features: ["User flows & wireframes", "Interface design", "Design systems", "Usability review"] },
];

/** Package descriptions and features. Prices are never seeded; the owner sets CAD and INR prices in Admin. */
export const PACKAGES = [
  { name: "Website", description: "Professional, responsive website designed around your business.", features: ["Custom design", "Mobile-responsive layout", "Contact and enquiry forms", "Basic SEO setup", "Launch support"], highlighted: false },
  { name: "Online Store", description: "A professional e-commerce website for selling products or services online.", features: ["Product catalog", "Shopping cart", "Checkout", "Payment integration", "Order management", "Launch support"], highlighted: false },
  { name: "Booking & Appointment System", description: "Make it easier for customers to schedule your services online.", features: ["Service listings", "Appointment scheduling", "Customer information", "Booking management", "Notifications", "Admin management"], highlighted: false },
  { name: "Business Application", description: "Custom software designed around your business workflow.", features: ["User accounts", "Custom features", "Admin tools", "Dashboard", "Integrations where required"], highlighted: false },
  { name: "Mobile Application", description: "Mobile applications for businesses that need an iOS or Android experience.", features: ["iOS and Android support where applicable", "Application development", "Backend and API integration", "Testing", "App store preparation"], highlighted: false },
  { name: "Custom Solution", description: "For businesses with requirements that do not fit a standard package.", features: ["Custom scope", "Custom integrations", "Tailored development", "Phased delivery where appropriate"], highlighted: false },
];

export const PORTFOLIO = [
  { slug: "bella-verde-concept", title: "Bella Verde — Restaurant website", industry: "Restaurant", image: "bella-verde", services: ["Website Design", "Business Websites"], featured: true, description: "A menu-first restaurant concept with reservations, hours and location up front." },
  { slug: "northstar-plumbing-concept", title: "Northstar Plumbing — Service website", industry: "Plumbing", image: "northstar-plumbing", services: ["Business Websites", "SEO Foundations"], featured: true, description: "A trades website built around quote requests, service areas and click-to-call on mobile." },
  { slug: "urban-glow-concept", title: "Urban Glow — Salon website", industry: "Salon", image: "urban-glow", services: ["Website Design", "Landing Pages"], featured: true, description: "A calm, image-led salon concept with services, pricing and online booking." },
  { slug: "harbor-dental-concept", title: "Harbor Dental — Practice website", industry: "Dental", image: "harbor-dental", services: ["Website Redesign", "SEO Foundations"], featured: false, description: "A reassuring dental practice concept focused on new-patient information and appointments." },
  { slug: "maple-olive-concept", title: "Maple & Olive — Landscaping website", industry: "Landscaping", image: "maple-olive", services: ["Business Websites", "Website Development"], featured: false, description: "A project gallery and seasonal services layout for a landscaping company." },
  { slug: "summit-electric-concept", title: "Summit Electric — Contractor website", industry: "Electrical", image: "summit-electric", services: ["Landing Pages", "Website Design"], featured: false, description: "A straightforward contractor concept emphasizing licensing, service list and fast contact." },
];


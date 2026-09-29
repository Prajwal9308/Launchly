/**
 * Kinds of solutions CoreGravity builds for small businesses. These are
 * capabilities, not completed client projects; every visual is labelled as a
 * concept example.
 */
export const SOLUTIONS = [
  {
    slug: "business-websites",
    title: "Business Websites",
    icon: "globe",
    description:
      "Professional websites that establish credibility and make it easy for customers to learn about your business and contact you.",
    examples: ["Company websites", "Service websites", "Landing pages", "Website redesigns"],
  },
  {
    slug: "online-stores",
    title: "Online Stores",
    icon: "shopping-cart",
    description: "E-commerce websites with product catalogs, checkout, payments and order management.",
    examples: ["Product catalogs", "Shopping cart and checkout", "Payment integration", "Order management"],
  },
  {
    slug: "booking-systems",
    title: "Booking & Appointment Systems",
    icon: "calendar-check",
    description: "Online scheduling solutions for appointments, consultations, services and reservations.",
    examples: ["Appointment scheduling", "Service and staff calendars", "Booking reminders", "Reservation management"],
  },
  {
    slug: "business-applications",
    title: "Business Applications",
    icon: "layout-dashboard",
    description: "Custom tools, dashboards and portals designed around your daily operations.",
    examples: ["Sales and job tracking", "Reporting dashboards", "Inventory management", "Staff tools"],
  },
  {
    slug: "customer-portals",
    title: "Customer Portals",
    icon: "user-lock",
    description: "Secure areas where customers can access information, documents, appointments or services.",
    examples: ["Customer accounts", "Document sharing", "Appointment history", "Service requests"],
  },
  {
    slug: "business-automation",
    title: "Business Automation",
    icon: "workflow",
    description: "Integrations and workflows that reduce repetitive administrative work.",
    examples: ["System integrations", "Automated notifications", "Form and data workflows", "Reporting automation"],
  },
] as const;

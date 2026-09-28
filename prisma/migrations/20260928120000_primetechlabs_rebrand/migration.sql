-- PrimeTechLabs rebrand: web + mobile positioning.

-- Contact form now captures an optional budget range.
ALTER TABLE "Lead" ADD COLUMN "budgetRange" TEXT;

-- Brand defaults.
ALTER TABLE "SiteSettings" ALTER COLUMN "businessName" SET DEFAULT 'PrimeTechLabs',
  ALTER COLUMN "tagline" SET DEFAULT 'Websites and mobile apps for businesses and entrepreneurs.';
UPDATE "SiteSettings" SET "businessName" = 'PrimeTechLabs' WHERE "businessName" = 'Launchly';
UPDATE "SiteSettings" SET "tagline" = 'Websites and mobile apps for businesses and entrepreneurs.'
  WHERE "tagline" IN (
    'Websites for small businesses',
    'Professional websites that help businesses establish an online presence and make it easier for customers to get in touch.'
  );

-- Replace the old website-only default services, but only ones the owner never edited.
-- Services linked to a project are unpublished instead of deleted.
WITH old_defaults AS (
  SELECT id FROM "Service"
  WHERE slug IN ('website-design','website-development','landing-pages','business-websites','ecommerce-websites',
                 'website-redesign','seo-foundations','website-maintenance','content-updates','digital-marketing-support')
    AND "updatedAt" - "createdAt" < interval '5 seconds'
)
UPDATE "Service" SET published = false
  WHERE id IN (SELECT id FROM old_defaults) AND id IN (SELECT "serviceId" FROM "ProjectService");

DELETE FROM "Service"
  WHERE slug IN ('website-design','website-development','landing-pages','business-websites','ecommerce-websites',
                 'website-redesign','seo-foundations','website-maintenance','content-updates','digital-marketing-support')
    AND "updatedAt" - "createdAt" < interval '5 seconds'
    AND id NOT IN (SELECT "serviceId" FROM "ProjectService");

-- Add the new default services only on sites that already had a catalog (new sites get them from the bootstrap).
INSERT INTO "Service" (id, slug, name, summary, features, icon, published, "sortOrder", "createdAt", "updatedAt")
SELECT gen_random_uuid(), v.slug, v.name, v.summary, v.features, v.icon, true, v.sort, now(), now()
FROM (VALUES
  ('web-development', 'Web Development', 'Responsive websites and custom web applications, from business sites to dashboards and portals.',
    ARRAY['Business & landing pages','Custom web applications','Client portals & dashboards','Responsive on every device'], 'monitor', 0),
  ('mobile-app-development', 'Mobile App Development', 'iOS, Android and cross-platform apps for customers or internal teams.',
    ARRAY['iOS & Android','Cross-platform apps','MVPs & prototypes','App store release'], 'smartphone', 1),
  ('ui-ux-design', 'UI/UX Design', 'Clean, intuitive interfaces designed around how people actually use your product.',
    ARRAY['User flows & wireframes','Interface design','Design systems','Usability review'], 'palette', 2),
  ('ecommerce-development', 'E-commerce Development', 'Online stores and commerce experiences with secure checkout and product management.',
    ARRAY['Online stores','Checkout & payments','Product management'], 'shopping-cart', 3),
  ('business-solutions', 'Business Solutions', 'Custom digital tools built around your specific business workflows.',
    ARRAY['Booking & scheduling','Internal tools','Integrations & automation'], 'workflow', 4)
) AS v(slug, name, summary, features, icon, sort)
WHERE EXISTS (SELECT 1 FROM "SiteSettings")
ON CONFLICT (slug) DO NOTHING;

-- Rename untouched, unpriced default packages to fit web + mobile.
UPDATE "PricingPackage" SET name = 'Website', description = 'A professional, responsive website for your business.',
  features = ARRAY['Custom design','Mobile-friendly','Contact & inquiry forms','Launch support']
  WHERE name = 'Starter Website' AND "priceCents" IS NULL AND "updatedAt" - "createdAt" < interval '5 seconds';
UPDATE "PricingPackage" SET name = 'Web Application', description = 'A custom browser-based product such as a portal, dashboard or booking system.',
  features = ARRAY['User accounts','Custom features','Admin tools','Hosting setup']
  WHERE name = 'Business Website' AND "priceCents" IS NULL AND "updatedAt" - "createdAt" < interval '5 seconds';
UPDATE "PricingPackage" SET name = 'Mobile App', description = 'An iOS and Android app for your customers or team.',
  features = ARRAY['iOS & Android','App store release','Backend & APIs','Post-launch support']
  WHERE name = 'Premium Website' AND "priceCents" IS NULL AND "updatedAt" - "createdAt" < interval '5 seconds';
UPDATE "PricingPackage" SET name = 'Custom Project'
  WHERE name = 'Custom Website' AND "priceCents" IS NULL AND "updatedAt" - "createdAt" < interval '5 seconds';

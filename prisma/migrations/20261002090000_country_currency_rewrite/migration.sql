/*
  Warnings:

  - You are about to drop the column `priceCents` on the `PricingPackage` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Country" AS ENUM ('CA', 'IN');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "FileCategory" ADD VALUE 'PROPOSAL';
ALTER TYPE "FileCategory" ADD VALUE 'AGREEMENT';
ALTER TYPE "FileCategory" ADD VALUE 'INVOICE';
ALTER TYPE "FileCategory" ADD VALUE 'MAINTENANCE_AGREEMENT';

-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "country" "Country";

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "country" "Country";

-- AlterTable
ALTER TABLE "PricingPackage" DROP COLUMN "priceCents",
ADD COLUMN     "priceCad" INTEGER,
ADD COLUMN     "priceInr" INTEGER;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "country" "Country";

-- AlterTable
ALTER TABLE "SiteSettings" ADD COLUMN     "budgetRangesCa" TEXT[] DEFAULT ARRAY['Under CA$2,000', 'CA$2,000 – CA$5,000', 'CA$5,000 – CA$10,000', 'CA$10,000 – CA$20,000', 'CA$20,000+', 'Not sure yet']::TEXT[],
ADD COLUMN     "budgetRangesIn" TEXT[] DEFAULT ARRAY['Under ₹75,000', '₹75,000 – ₹1,50,000', '₹1,50,000 – ₹3,00,000', '₹3,00,000 – ₹5,00,000', '₹5,00,000+', 'Not sure yet']::TEXT[],
ADD COLUMN     "businessAddress" TEXT,
ADD COLUMN     "governingJurisdiction" TEXT,
ADD COLUMN     "legalEffectiveDate" DATE,
ADD COLUMN     "legalName" TEXT,
ADD COLUMN     "privacyContactEmail" TEXT,
ADD COLUMN     "taxNoteCa" TEXT NOT NULL DEFAULT 'Plus applicable taxes.',
ADD COLUMN     "taxNoteIn" TEXT NOT NULL DEFAULT 'Plus applicable GST, where applicable.',
ALTER COLUMN "tagline" SET DEFAULT 'Professional websites and digital solutions for small businesses.';

-- ---------------------------------------------------------------------------
-- Content: small-business positioning. Each update only touches rows that
-- still hold the previous default text, so owner edits are never overwritten.
-- ---------------------------------------------------------------------------

UPDATE "SiteSettings"
SET "tagline" = 'Professional websites and digital solutions for small businesses.', "updatedAt" = NOW()
WHERE "tagline" = 'Websites and mobile apps for businesses and entrepreneurs.';

-- Services
UPDATE "Service" SET
  "name" = 'Website Development',
  "icon" = 'globe',
  "summary" = 'Professional, responsive websites designed around your business and customers.',
  "description" = 'A clear, well-organized website that explains what you offer, works on every screen size and makes it easy for customers to contact you.',
  "features" = ARRAY['Business websites', 'Landing pages', 'Website redesigns', 'Mobile-responsive layouts'],
  "sortOrder" = 0, "updatedAt" = NOW()
WHERE "slug" = 'web-development'
  AND "summary" = 'Responsive websites and custom web applications, from business sites to dashboards and portals.';

UPDATE "Service" SET
  "summary" = 'Online stores with product management, checkout, payments and order management.',
  "description" = 'Sell products or services online with a store that is straightforward for customers to use and for your team to manage.',
  "features" = ARRAY['Online stores', 'Product catalogs', 'Checkout & payments', 'Order management'],
  "sortOrder" = 1, "updatedAt" = NOW()
WHERE "slug" = 'ecommerce-development'
  AND "summary" = 'Online stores and commerce experiences with secure checkout and product management.';

UPDATE "Service" SET
  "name" = 'Business Applications',
  "icon" = 'layout-dashboard',
  "summary" = 'Custom dashboards, portals and internal tools designed around your workflow.',
  "description" = 'Software built around the way your business already operates, so your team spends less time on manual work.',
  "features" = ARRAY['Dashboards & reporting', 'Customer & staff portals', 'Internal tools', 'Integrations & automation'],
  "sortOrder" = 3, "updatedAt" = NOW()
WHERE "slug" = 'business-solutions'
  AND "summary" = 'Booking systems, internal tools and integrations built around how your business runs.';

UPDATE "Service" SET
  "summary" = 'iOS and Android applications for businesses that need a dedicated mobile experience.',
  "description" = 'Mobile applications for your customers or your team, planned around what people need to do on their phones.',
  "features" = ARRAY['iOS & Android', 'Customer & staff apps', 'Backend & API integration', 'App store preparation'],
  "sortOrder" = 4, "updatedAt" = NOW()
WHERE "slug" = 'mobile-app-development'
  AND "summary" = 'iOS, Android and cross-platform apps for customers or internal teams.';

UPDATE "Service" SET
  "summary" = 'Clear, professional interfaces designed to make websites and applications easy to use.',
  "description" = 'Layouts and user journeys designed around your customers, so they can find information and complete tasks without confusion.',
  "sortOrder" = 5, "updatedAt" = NOW()
WHERE "slug" = 'ui-ux-design'
  AND "summary" = 'Clean, intuitive interfaces designed around how people actually use your product.';

-- New service, on sites that have already been set up (new sites get it from the bootstrap).
INSERT INTO "Service" ("id", "slug", "name", "summary", "description", "features", "icon", "published", "sortOrder", "createdAt", "updatedAt")
SELECT gen_random_uuid(), 'booking-systems', 'Booking & Appointment Systems',
  'Online scheduling solutions that make it easier for customers to book your services.',
  'Let customers see what you offer, choose a time and book online, while your team manages appointments in one place.',
  ARRAY['Appointment scheduling', 'Service listings', 'Booking management', 'Customer notifications'],
  'calendar-check', true, 2, NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM "SiteSettings")
  AND NOT EXISTS (SELECT 1 FROM "Service" WHERE "slug" = 'booking-systems');

-- Pricing packages
UPDATE "PricingPackage" SET
  "description" = 'Professional, responsive website designed around your business.',
  "features" = ARRAY['Custom design', 'Mobile-responsive layout', 'Contact and enquiry forms', 'Basic SEO setup', 'Launch support'],
  "sortOrder" = 0, "updatedAt" = NOW()
WHERE "name" = 'Website' AND "description" = 'A professional, responsive website for your business.';

UPDATE "PricingPackage" SET
  "name" = 'Business Application',
  "description" = 'Custom software designed around your business workflow.',
  "features" = ARRAY['User accounts', 'Custom features', 'Admin tools', 'Dashboard', 'Integrations where required'],
  "highlighted" = false,
  "sortOrder" = 3, "updatedAt" = NOW()
WHERE "name" = 'Web Application' AND "description" = 'A custom browser-based product such as a portal, dashboard or booking system.';

UPDATE "PricingPackage" SET
  "name" = 'Mobile Application',
  "description" = 'Mobile applications for businesses that need an iOS or Android experience.',
  "features" = ARRAY['iOS and Android support where applicable', 'Application development', 'Backend and API integration', 'Testing', 'App store preparation'],
  "sortOrder" = 4, "updatedAt" = NOW()
WHERE "name" = 'Mobile App' AND "description" = 'An iOS and Android app for your customers or team.';

UPDATE "PricingPackage" SET
  "name" = 'Custom Solution',
  "description" = 'For businesses with requirements that do not fit a standard package.',
  "features" = ARRAY['Custom scope', 'Custom integrations', 'Tailored development', 'Phased delivery where appropriate'],
  "sortOrder" = 5, "updatedAt" = NOW()
WHERE "name" = 'Custom Project' AND "description" = 'For larger or unusual projects that need a tailored plan.';

INSERT INTO "PricingPackage" ("id", "name", "description", "features", "highlighted", "published", "sortOrder", "createdAt", "updatedAt")
SELECT gen_random_uuid(), 'Online Store',
  'A professional e-commerce website for selling products or services online.',
  ARRAY['Product catalog', 'Shopping cart', 'Checkout', 'Payment integration', 'Order management', 'Launch support'],
  false, true, 1, NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM "SiteSettings")
  AND NOT EXISTS (SELECT 1 FROM "PricingPackage" WHERE "name" = 'Online Store');

INSERT INTO "PricingPackage" ("id", "name", "description", "features", "highlighted", "published", "sortOrder", "createdAt", "updatedAt")
SELECT gen_random_uuid(), 'Booking & Appointment System',
  'Make it easier for customers to schedule your services online.',
  ARRAY['Service listings', 'Appointment scheduling', 'Customer information', 'Booking management', 'Notifications', 'Admin management'],
  false, true, 2, NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM "SiteSettings")
  AND NOT EXISTS (SELECT 1 FROM "PricingPackage" WHERE "name" = 'Booking & Appointment System');

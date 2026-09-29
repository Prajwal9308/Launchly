-- CoreGravity rebrand (formerly ViperByte).

-- New default for fresh databases.
ALTER TABLE "SiteSettings" ALTER COLUMN "businessName" SET DEFAULT 'CoreGravity';

-- Rename existing sites only if the owner never changed the default name.
UPDATE "SiteSettings" SET "businessName" = 'CoreGravity', "updatedAt" = now() WHERE "businessName" IN ('ViperByte', 'PrimeTechLabs', 'Foxbyte');

-- Replace the seeded placeholder contact address with the studio's real inbox.
UPDATE "SiteSettings" SET "contactEmail" = 'info.viperbyte@yahoo.com', "updatedAt" = now() WHERE "contactEmail" = 'hello@example.com';

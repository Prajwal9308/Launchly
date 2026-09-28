-- ViperByte rebrand (formerly PrimeTechLabs).

-- New default for fresh databases.
ALTER TABLE "SiteSettings" ALTER COLUMN "businessName" SET DEFAULT 'ViperByte';

-- Rename existing sites only if the owner never changed the default name.
UPDATE "SiteSettings" SET "businessName" = 'ViperByte', "updatedAt" = now() WHERE "businessName" IN ('PrimeTechLabs', 'Foxbyte');

-- Budget ranges for the CA$500 – CA$5,000 small-business pricing.
ALTER TABLE "SiteSettings" ALTER COLUMN "budgetRangesCa" SET DEFAULT ARRAY['CA$500 – CA$1,000', 'CA$1,000 – CA$2,000', 'CA$2,000 – CA$3,500', 'CA$3,500 – CA$5,000', 'CA$5,000+', 'Not sure yet']::TEXT[],
ALTER COLUMN "budgetRangesIn" SET DEFAULT ARRAY['₹30,000 – ₹60,000', '₹60,000 – ₹1,20,000', '₹1,20,000 – ₹2,10,000', '₹2,10,000 – ₹3,00,000', '₹3,00,000+', 'Not sure yet']::TEXT[];

-- Replace the stored ranges only where they are still the old defaults, so edits made in Admin are kept.
UPDATE "SiteSettings" SET "budgetRangesCa" = ARRAY['CA$500 – CA$1,000', 'CA$1,000 – CA$2,000', 'CA$2,000 – CA$3,500', 'CA$3,500 – CA$5,000', 'CA$5,000+', 'Not sure yet']::TEXT[] WHERE "budgetRangesCa" = ARRAY['Under CA$2,000', 'CA$2,000 – CA$5,000', 'CA$5,000 – CA$10,000', 'CA$10,000 – CA$20,000', 'CA$20,000+', 'Not sure yet']::TEXT[];
UPDATE "SiteSettings" SET "budgetRangesIn" = ARRAY['₹30,000 – ₹60,000', '₹60,000 – ₹1,20,000', '₹1,20,000 – ₹2,10,000', '₹2,10,000 – ₹3,00,000', '₹3,00,000+', 'Not sure yet']::TEXT[] WHERE "budgetRangesIn" = ARRAY['Under ₹75,000', '₹75,000 – ₹1,50,000', '₹1,50,000 – ₹3,00,000', '₹3,00,000 – ₹5,00,000', '₹5,00,000+', 'Not sure yet']::TEXT[];

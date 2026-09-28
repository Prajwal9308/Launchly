-- Rename the default "Business Solutions" service, only if the owner hasn't edited it.
UPDATE "Service"
SET "name" = 'Custom Business Solutions',
    "summary" = 'Booking systems, internal tools and integrations built around how your business runs.',
    "updatedAt" = NOW()
WHERE "slug" = 'business-solutions'
  AND "name" = 'Business Solutions'
  AND "summary" = 'Custom digital tools built around your specific business workflows.';

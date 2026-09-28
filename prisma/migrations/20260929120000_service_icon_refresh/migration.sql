-- Clearer icons for two default services, only where the owner hasn't picked a different one.
UPDATE "Service" SET "icon" = 'pen-tool', "updatedAt" = NOW() WHERE "slug" = 'ui-ux-design' AND "icon" = 'palette';
UPDATE "Service" SET "icon" = 'briefcase-business', "updatedAt" = NOW() WHERE "slug" = 'business-solutions' AND "icon" = 'workflow';

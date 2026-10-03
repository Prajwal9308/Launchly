-- Move the contact address to the coregravity.io inbox, only where the owner hasn't set a different one.
UPDATE "SiteSettings" SET "contactEmail" = 'info@coregravity.io', "updatedAt" = now() WHERE "contactEmail" IN ('info.coregravityio@yahoo.com', 'info.viperbyte@yahoo.com', 'hello@example.com');

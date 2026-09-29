-- Move the contact address to the CoreGravity inbox, only where the owner hasn't set a different one.
UPDATE "SiteSettings" SET "contactEmail" = 'info.coregravityio@yahoo.com', "updatedAt" = now() WHERE "contactEmail" IN ('info.viperbyte@yahoo.com', 'hello@example.com');

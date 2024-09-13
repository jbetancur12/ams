/*
  Warnings:

  - A unique constraint covering the columns `[email,ownerId]` on the table `Tenant` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Tenant_email_ownerId_key" ON "Tenant"("email", "ownerId");

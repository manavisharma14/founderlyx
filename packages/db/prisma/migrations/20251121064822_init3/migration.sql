/*
  Warnings:

  - The `status` column on the `Contact` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ContactStatus" AS ENUM ('new', 'drafted', 'sent', 'replied', 'dead', 'unsubscribed');

-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "openedAt" TIMESTAMP(3),
ADD COLUMN     "sentAt" TIMESTAMP(3),
DROP COLUMN "status",
ADD COLUMN     "status" "ContactStatus" NOT NULL DEFAULT 'new';

-- CreateIndex
CREATE INDEX "Contact_status_idx" ON "Contact"("status");

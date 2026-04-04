/*
  Warnings:

  - The values [drafted,sent] on the enum `ContactStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ContactStatus_new" AS ENUM ('new', 'ready', 'sending', 'replied', 'interested', 'meeting_booked', 'finished', 'dead', 'unsubscribed');
ALTER TABLE "public"."Contact" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Contact" ALTER COLUMN "status" TYPE "ContactStatus_new" USING ("status"::text::"ContactStatus_new");
ALTER TYPE "ContactStatus" RENAME TO "ContactStatus_old";
ALTER TYPE "ContactStatus_new" RENAME TO "ContactStatus";
DROP TYPE "public"."ContactStatus_old";
ALTER TABLE "Contact" ALTER COLUMN "status" SET DEFAULT 'new';
COMMIT;

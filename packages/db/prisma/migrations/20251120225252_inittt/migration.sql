-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "unsubscribed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "unsubscribedAt" TIMESTAMP(3);

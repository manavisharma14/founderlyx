-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "nextSendAt" TIMESTAMP(3),
ADD COLUMN     "sequenceStep" INTEGER NOT NULL DEFAULT 0;

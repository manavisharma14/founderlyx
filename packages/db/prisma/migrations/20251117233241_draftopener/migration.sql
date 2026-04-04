/*
  Warnings:

  - You are about to drop the column `draftOpenener` on the `Contact` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "draftOpenener",
ADD COLUMN     "draftOpener" TEXT;

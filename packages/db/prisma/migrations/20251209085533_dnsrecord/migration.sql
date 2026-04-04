/*
  Warnings:

  - You are about to drop the column `dkimTokens` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `sesTxtToken` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "dkimTokens",
DROP COLUMN "sesTxtToken",
ADD COLUMN     "dnsRecords" JSONB;

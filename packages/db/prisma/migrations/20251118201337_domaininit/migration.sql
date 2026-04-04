-- AlterTable
ALTER TABLE "User" ADD COLUMN     "dkimTokens" TEXT[],
ADD COLUMN     "domain" TEXT,
ADD COLUMN     "domainVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sendingEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sesTxtToken" TEXT;

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

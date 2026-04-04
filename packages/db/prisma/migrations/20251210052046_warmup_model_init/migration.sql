-- CreateTable
CREATE TABLE "WarmupEmail" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WarmupEmail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WarmupEmail_userId_idx" ON "WarmupEmail"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "WarmupEmail_userId_email_key" ON "WarmupEmail"("userId", "email");

-- AddForeignKey
ALTER TABLE "WarmupEmail" ADD CONSTRAINT "WarmupEmail_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

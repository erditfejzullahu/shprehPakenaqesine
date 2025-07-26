-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "emailVerificationToken" TEXT,
ADD COLUMN     "emailVerificationTokenExpires" TEXT,
ALTER COLUMN "fullName" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "Users_email_idx" ON "Users"("email");

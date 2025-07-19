-- DropForeignKey
ALTER TABLE "Complaint" DROP CONSTRAINT "Complaint_userId_fkey";

-- DropForeignKey
ALTER TABLE "Reports" DROP CONSTRAINT "Reports_complaintId_fkey";

-- CreateIndex
CREATE INDEX "Companies_name_idx" ON "Companies"("name");

-- CreateIndex
CREATE INDEX "Companies_industry_idx" ON "Companies"("industry");

-- CreateIndex
CREATE INDEX "Companies_foundedYear_idx" ON "Companies"("foundedYear");

-- CreateIndex
CREATE INDEX "Complaint_category_idx" ON "Complaint"("category");

-- CreateIndex
CREATE INDEX "Complaint_status_idx" ON "Complaint"("status");

-- CreateIndex
CREATE INDEX "Complaint_resolvedStatus_idx" ON "Complaint"("resolvedStatus");

-- CreateIndex
CREATE INDEX "Complaint_createdAt_idx" ON "Complaint"("createdAt");

-- CreateIndex
CREATE INDEX "Complaint_upVotes_idx" ON "Complaint"("upVotes");

-- CreateIndex
CREATE INDEX "Complaint_title_idx" ON "Complaint"("title");

-- CreateIndex
CREATE INDEX "Complaint_userId_idx" ON "Complaint"("userId");

-- CreateIndex
CREATE INDEX "Complaint_updatedAt_idx" ON "Complaint"("updatedAt");

-- CreateIndex
CREATE INDEX "Contributions_userId_idx" ON "Contributions"("userId");

-- CreateIndex
CREATE INDEX "Contributions_createdAt_idx" ON "Contributions"("createdAt");

-- CreateIndex
CREATE INDEX "Users_username_idx" ON "Users"("username");

-- AddForeignKey
ALTER TABLE "Complaint" ADD CONSTRAINT "Complaint_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reports" ADD CONSTRAINT "Reports_complaintId_fkey" FOREIGN KEY ("complaintId") REFERENCES "Complaint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

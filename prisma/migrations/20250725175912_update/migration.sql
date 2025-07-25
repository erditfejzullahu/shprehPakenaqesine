-- DropForeignKey
ALTER TABLE "Contributions" DROP CONSTRAINT "Contributions_complaintId_fkey";

-- DropForeignKey
ALTER TABLE "Contributions" DROP CONSTRAINT "Contributions_userId_fkey";

-- AddForeignKey
ALTER TABLE "Contributions" ADD CONSTRAINT "Contributions_complaintId_fkey" FOREIGN KEY ("complaintId") REFERENCES "Complaint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contributions" ADD CONSTRAINT "Contributions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

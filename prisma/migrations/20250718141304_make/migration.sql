-- DropForeignKey
ALTER TABLE "Complaint" DROP CONSTRAINT "Complaint_companyId_fkey";

-- AlterTable
ALTER TABLE "Complaint" ALTER COLUMN "companyId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Complaint" ADD CONSTRAINT "Complaint_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- DropForeignKey
ALTER TABLE "ComplaintUpVotes" DROP CONSTRAINT "ComplaintUpVotes_complaintId_fkey";

-- DropForeignKey
ALTER TABLE "ComplaintUpVotes" DROP CONSTRAINT "ComplaintUpVotes_userId_fkey";

-- AddForeignKey
ALTER TABLE "ComplaintUpVotes" ADD CONSTRAINT "ComplaintUpVotes_complaintId_fkey" FOREIGN KEY ("complaintId") REFERENCES "Complaint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComplaintUpVotes" ADD CONSTRAINT "ComplaintUpVotes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

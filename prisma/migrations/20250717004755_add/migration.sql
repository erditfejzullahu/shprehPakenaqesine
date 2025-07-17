-- CreateEnum
CREATE TYPE "ReportsCategory" AS ENUM ('LAJMERIM_I_RREMSHEM', 'SHPIFJE', 'GJUHE_URREJTJE', 'PERVERSE_OSE_ABUZIVE', 'SPAM_OSE_DUPLIKAT', 'JO_RELAVANT', 'SHKELJE_PRIVATESIE', 'TJETER');

-- CreateTable
CREATE TABLE "Reports" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "descrition" TEXT NOT NULL,
    "attachments" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "audioAttachments" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "videoAttachments" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "complaintId" TEXT NOT NULL,
    "category" "ReportsCategory" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reports_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Reports" ADD CONSTRAINT "Reports_complaintId_fkey" FOREIGN KEY ("complaintId") REFERENCES "Complaint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

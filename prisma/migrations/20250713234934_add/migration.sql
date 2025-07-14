-- AlterTable
ALTER TABLE "Complaint" ADD COLUMN     "audiosAttached" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "videosAttached" TEXT[] DEFAULT ARRAY[]::TEXT[];

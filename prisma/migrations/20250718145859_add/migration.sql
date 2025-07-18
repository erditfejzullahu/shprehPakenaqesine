-- AlterTable
ALTER TABLE "Contributions" ADD COLUMN     "attachments" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "audiosAttached" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "videosAttached" TEXT[] DEFAULT ARRAY[]::TEXT[];

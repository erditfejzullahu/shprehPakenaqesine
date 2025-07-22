-- AlterEnum
ALTER TYPE "ActivityAction" ADD VALUE 'UPVOTE_COMPLAINT';

-- AlterTable
ALTER TABLE "ActivityLog" ALTER COLUMN "entityId" DROP NOT NULL;

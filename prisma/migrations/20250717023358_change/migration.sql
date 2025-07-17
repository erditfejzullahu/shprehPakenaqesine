/*
  Warnings:

  - The `attachments` column on the `Complaint` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Complaint" DROP COLUMN "attachments",
ADD COLUMN     "attachments" TEXT[] DEFAULT ARRAY[]::TEXT[];

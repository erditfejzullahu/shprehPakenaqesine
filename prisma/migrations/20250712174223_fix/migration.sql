/*
  Warnings:

  - You are about to drop the column `updatedat` on the `Complaint` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Complaint` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Complaint" DROP COLUMN "updatedat",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

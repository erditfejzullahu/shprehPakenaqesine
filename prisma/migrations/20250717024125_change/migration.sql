/*
  Warnings:

  - The `images` column on the `Companies` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Companies" DROP COLUMN "images",
ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[];

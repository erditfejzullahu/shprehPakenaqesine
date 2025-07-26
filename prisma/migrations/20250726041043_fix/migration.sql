/*
  Warnings:

  - The `emailVerificationTokenExpires` column on the `Users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Users" DROP COLUMN "emailVerificationTokenExpires",
ADD COLUMN     "emailVerificationTokenExpires" TIMESTAMP(3);

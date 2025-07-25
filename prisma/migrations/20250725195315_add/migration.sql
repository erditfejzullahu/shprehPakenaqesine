-- CreateEnum
CREATE TYPE "ContactReason" AS ENUM ('NDIHMË', 'ANKESË', 'FSHIRJE', 'KËRKESË_E_RE', 'TJERA');

-- CreateTable
CREATE TABLE "ContactedUs" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "reason" "ContactReason" NOT NULL,
    "attachments" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactedUs_pkey" PRIMARY KEY ("id")
);

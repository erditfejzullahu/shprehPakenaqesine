-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "nickName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Companies" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "logoUrl" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "website" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "images" TEXT,
    "industry" TEXT NOT NULL,
    "foundedYear" TEXT,
    "acceptedRequest" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Companies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Companies_name_key" ON "Companies"("name");

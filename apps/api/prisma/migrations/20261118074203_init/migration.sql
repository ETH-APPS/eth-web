-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CUSTOMER', 'STAFF');

-- CreateEnum
CREATE TYPE "ShippingMethod" AS ENUM ('FCL', 'LCL', 'AIR');

-- CreateEnum
CREATE TYPE "CargoRequestStatus" AS ENUM ('PENDING_REVIEW', 'NEEDS_REVISION', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "whatsapp" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'CUSTOMER',
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CargoRequest" (
    "id" UUID NOT NULL,
    "customerId" UUID NOT NULL,
    "status" "CargoRequestStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "shippingMethod" "ShippingMethod" NOT NULL,
    "cargoType" TEXT NOT NULL,
    "heightCm" DECIMAL(12,2) NOT NULL,
    "lengthCm" DECIMAL(12,2) NOT NULL,
    "widthCm" DECIMAL(12,2) NOT NULL,
    "boxWeightKg" DECIMAL(12,3) NOT NULL,
    "boxCount" INTEGER NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "CargoRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "CargoRequest_customerId_createdAt_idx" ON "CargoRequest"("customerId", "createdAt");

-- CreateIndex
CREATE INDEX "CargoRequest_status_createdAt_idx" ON "CargoRequest"("status", "createdAt");

-- AddForeignKey
ALTER TABLE "CargoRequest" ADD CONSTRAINT "CargoRequest_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

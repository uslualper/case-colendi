/*
  Warnings:

  - You are about to drop the column `currency` on the `CardTransaction` table. All the data in the column will be lost.
  - You are about to drop the column `MCC` on the `Merchant` table. All the data in the column will be lost.
  - You are about to drop the `GPA` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `mccId` to the `Merchant` table without a default value. This is not possible if the table is not empty.
  - Made the column `gpaId` on table `Merchant` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "CardStatus" AS ENUM ('ACTIVE', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('STARTED', 'PENDING_VERIFICATION', 'COMPLETED', 'FAILED');

-- DropForeignKey
ALTER TABLE "Merchant" DROP CONSTRAINT "Merchant_gpaId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_gpaId_fkey";

-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "status" "CardStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "CardTransaction" DROP COLUMN "currency",
ADD COLUMN     "status" "TransactionStatus" NOT NULL DEFAULT 'STARTED';

-- AlterTable
ALTER TABLE "Merchant" DROP COLUMN "MCC",
ADD COLUMN     "mccId" INTEGER NOT NULL,
ALTER COLUMN "gpaId" SET NOT NULL;

-- DropTable
DROP TABLE "GPA";

-- CreateTable
CREATE TABLE "Gpa" (
    "id" SERIAL NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Gpa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MCC" (
    "id" SERIAL NOT NULL,
    "mccCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MCC_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CardMCC" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CardMCC_AB_unique" ON "_CardMCC"("A", "B");

-- CreateIndex
CREATE INDEX "_CardMCC_B_index" ON "_CardMCC"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_gpaId_fkey" FOREIGN KEY ("gpaId") REFERENCES "Gpa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Merchant" ADD CONSTRAINT "Merchant_gpaId_fkey" FOREIGN KEY ("gpaId") REFERENCES "Gpa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Merchant" ADD CONSTRAINT "Merchant_mccId_fkey" FOREIGN KEY ("mccId") REFERENCES "MCC"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CardMCC" ADD CONSTRAINT "_CardMCC_A_fkey" FOREIGN KEY ("A") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CardMCC" ADD CONSTRAINT "_CardMCC_B_fkey" FOREIGN KEY ("B") REFERENCES "MCC"("id") ON DELETE CASCADE ON UPDATE CASCADE;

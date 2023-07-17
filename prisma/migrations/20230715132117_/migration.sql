-- DropForeignKey
ALTER TABLE "Merchant" DROP CONSTRAINT "Merchant_gpaId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_gpaId_fkey";

-- AlterTable
ALTER TABLE "Merchant" ALTER COLUMN "gpaId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "gpaId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_gpaId_fkey" FOREIGN KEY ("gpaId") REFERENCES "GPA"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Merchant" ADD CONSTRAINT "Merchant_gpaId_fkey" FOREIGN KEY ("gpaId") REFERENCES "GPA"("id") ON DELETE SET NULL ON UPDATE CASCADE;

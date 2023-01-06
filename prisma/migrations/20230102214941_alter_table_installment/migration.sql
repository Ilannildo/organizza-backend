/*
  Warnings:

  - You are about to drop the column `installment` on the `installments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "installments" DROP COLUMN "installment",
ADD COLUMN     "number" INTEGER NOT NULL DEFAULT 1;

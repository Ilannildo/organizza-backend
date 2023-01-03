/*
  Warnings:

  - You are about to drop the column `fee` on the `payment_methods` table. All the data in the column will be lost.
  - You are about to drop the column `installments` on the `payment_methods` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "payment_methods" DROP COLUMN "fee",
DROP COLUMN "installments";

-- CreateTable
CREATE TABLE "installments" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "fee" DOUBLE PRECISION NOT NULL,
    "payment_method_id" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "installments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "installments" ADD CONSTRAINT "installments_payment_method_id_fkey" FOREIGN KEY ("payment_method_id") REFERENCES "payment_methods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

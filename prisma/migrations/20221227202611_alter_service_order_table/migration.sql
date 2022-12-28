/*
  Warnings:

  - You are about to drop the column `payment_method_id` on the `service_orders` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "service_orders" DROP CONSTRAINT "service_orders_payment_method_id_fkey";

-- AlterTable
ALTER TABLE "service_orders" DROP COLUMN "payment_method_id";

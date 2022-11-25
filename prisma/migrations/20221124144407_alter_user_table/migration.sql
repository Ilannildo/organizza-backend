/*
  Warnings:

  - You are about to drop the column `email_verificated_at` on the `users` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `email_token` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "email_token" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "email_verificated_at";

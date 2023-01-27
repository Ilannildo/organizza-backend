/*
  Warnings:

  - You are about to drop the column `category_title` on the `session_tickets` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `session_tickets` table. All the data in the column will be lost.
  - You are about to drop the column `due_date` on the `session_tickets` table. All the data in the column will be lost.
  - You are about to drop the column `due_time` on the `session_tickets` table. All the data in the column will be lost.
  - You are about to drop the column `include_fee` on the `session_tickets` table. All the data in the column will be lost.
  - You are about to drop the column `sold` on the `session_tickets` table. All the data in the column will be lost.
  - You are about to drop the column `start_date` on the `session_tickets` table. All the data in the column will be lost.
  - You are about to drop the column `start_time` on the `session_tickets` table. All the data in the column will be lost.
  - Made the column `summary` on table `sessions` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "session_tickets" DROP COLUMN "category_title",
DROP COLUMN "description",
DROP COLUMN "due_date",
DROP COLUMN "due_time",
DROP COLUMN "include_fee",
DROP COLUMN "sold",
DROP COLUMN "start_date",
DROP COLUMN "start_time";

-- AlterTable
ALTER TABLE "sessions" ALTER COLUMN "summary" SET NOT NULL,
ALTER COLUMN "responsible_name" DROP NOT NULL;

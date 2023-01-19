/*
  Warnings:

  - You are about to drop the column `due_time` on the `tickets` table. All the data in the column will be lost.
  - You are about to drop the column `start_time` on the `tickets` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tickets" DROP COLUMN "due_time",
DROP COLUMN "start_time";

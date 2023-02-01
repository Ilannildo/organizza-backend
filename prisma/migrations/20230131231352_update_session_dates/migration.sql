/*
  Warnings:

  - Added the required column `position` to the `SessionDates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `SessionDates` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SessionDateStatus" AS ENUM ('started', 'finished');

-- AlterTable
ALTER TABLE "SessionDates" ADD COLUMN     "position" INTEGER NOT NULL,
ADD COLUMN     "status" "SessionDateStatus" NOT NULL;

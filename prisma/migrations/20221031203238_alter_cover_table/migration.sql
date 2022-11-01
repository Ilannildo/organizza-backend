/*
  Warnings:

  - You are about to drop the column `event_cover_id` on the `events` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[event_id]` on the table `event_covers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `event_id` to the `event_covers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_event_cover_id_fkey";

-- DropIndex
DROP INDEX "events_event_cover_id_key";

-- AlterTable
ALTER TABLE "event_covers" ADD COLUMN     "event_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "events" DROP COLUMN "event_cover_id";

-- CreateIndex
CREATE UNIQUE INDEX "event_covers_event_id_key" ON "event_covers"("event_id");

-- AddForeignKey
ALTER TABLE "event_covers" ADD CONSTRAINT "event_covers_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `cover_url` on the `events` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[event_cover_id]` on the table `events` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "events" DROP COLUMN "cover_url",
ADD COLUMN     "event_cover_id" TEXT;

-- CreateTable
CREATE TABLE "event_covers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "key" TEXT NOT NULL,
    "url" TEXT,

    CONSTRAINT "event_covers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "events_event_cover_id_key" ON "events"("event_cover_id");

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_event_cover_id_fkey" FOREIGN KEY ("event_cover_id") REFERENCES "event_covers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `event_responsibles` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "addresses" ALTER COLUMN "neighborhood" DROP NOT NULL;

-- CreateTable
CREATE TABLE "events_has_addresses" (
    "event_id" TEXT NOT NULL,
    "address_id" TEXT NOT NULL,

    CONSTRAINT "events_has_addresses_pkey" PRIMARY KEY ("event_id","address_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "events_has_addresses_event_id_key" ON "events_has_addresses"("event_id");

-- CreateIndex
CREATE UNIQUE INDEX "events_has_addresses_address_id_key" ON "events_has_addresses"("address_id");

-- CreateIndex
CREATE UNIQUE INDEX "event_responsibles_email_key" ON "event_responsibles"("email");

-- AddForeignKey
ALTER TABLE "events_has_addresses" ADD CONSTRAINT "events_has_addresses_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events_has_addresses" ADD CONSTRAINT "events_has_addresses_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

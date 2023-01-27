/*
  Warnings:

  - A unique constraint covering the columns `[session_id]` on the table `session_tickets` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "session_tickets_session_id_key" ON "session_tickets"("session_id");

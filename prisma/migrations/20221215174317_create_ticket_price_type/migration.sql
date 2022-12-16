-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_ticket_price_type_id_fkey" FOREIGN KEY ("ticket_price_type_id") REFERENCES "ticket_price_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

import { TicketServiceOrderModel } from "../../models/ticket-service-order.model";

export interface ITicketServiceOrderRepository {
  save(data: TicketServiceOrderModel): Promise<TicketServiceOrderModel>;
  findByUserIdTicketId(data: {
    ticketId: string;
    userId: string;
    status: "open" | "processing" | "settled" | "closed" | "canceled";
  }): Promise<TicketServiceOrderModel>;
}

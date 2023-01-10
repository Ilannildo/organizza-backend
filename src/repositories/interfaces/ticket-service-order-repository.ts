import { TicketServiceOrderModel } from "../../models/ticket-service-order.model";

export interface ITicketServiceOrderRepository {
  save(data: TicketServiceOrderModel): Promise<TicketServiceOrderModel>;
  findByUserIdTicketId(data: {
    ticketId: string;
    userId: string;
    status: "open" | "processing" | "settled" | "closed" | "canceled";
  }): Promise<TicketServiceOrderModel>;
  findAllByTicketId(data: {
    ticketId: string;
    status: "open" | "processing" | "settled" | "closed" | "canceled";
  }): Promise<TicketServiceOrderModel[]>;
  findAllByEventId(data: {
    eventId: string;
    status: "open" | "processing" | "settled" | "closed" | "canceled";
  }): Promise<TicketServiceOrderModel[]>;
}

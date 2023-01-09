import { TicketServiceOrderModel } from "../../models/ticket-service-order.model";
import { client } from "../../prisma/client";
import { ITicketServiceOrderRepository } from "../interfaces/ticket-service-order-repository";

export class PrismaTicketServiceOrderRepository
  implements ITicketServiceOrderRepository
{
  async findAllByTicketId({
    status,
    ticketId, 
  }: {
    ticketId: string;
    status: "processing" | "open" | "settled" | "closed" | "canceled";
  }): Promise<TicketServiceOrderModel[]> {
    const serviceOrder = await client.ticketServiceOrder.findMany({
      where: {
        ticket_id: ticketId,
        service_order: {
          status,
        },
      },
      include: {
        service_order: true,
      },
    });

    return serviceOrder;
  }
  async findByUserIdTicketId({
    ticketId,
    userId,
    status,
  }: {
    ticketId: string;
    userId: string;
    status: "open" | "processing" | "settled" | "closed" | "canceled";
  }): Promise<TicketServiceOrderModel> {
    const serviceOrder = await client.ticketServiceOrder.findFirst({
      where: {
        ticket_id: ticketId,
        service_order: {
          user_id: userId,
          status,
        },
      },
      include: {
        service_order: true,
      },
    });

    return serviceOrder;
  }

  async save(data: TicketServiceOrderModel): Promise<TicketServiceOrderModel> {
    const serviceOrder = await client.ticketServiceOrder.create({
      data: {
        service_order: {
          connect: {
            id: data.service_order_id,
          },
        },
        ticket: {
          connect: {
            id: data.ticket_id,
          },
        },
      },
    });

    return serviceOrder;
  }
}

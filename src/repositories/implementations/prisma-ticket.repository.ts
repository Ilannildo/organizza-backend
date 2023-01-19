import { TicketModel } from "../../models/ticket.model";
import { client } from "../../prisma/client";
import { ITicketRepository } from "../interfaces/ticket-repository";

export class PrismaTicketRepository implements ITicketRepository {
  async findByEventIdPaginate({
    eventId,
    limit,
    page,
  }: {
    eventId: string;
    page: number;
    limit: number;
  }): Promise<[number, TicketModel[]]> {
    const skip = Math.abs(page - 1) * limit;
    const tickets = await client.$transaction([
      client.ticket.count({
        where: {
          event_id: eventId,
        },
      }),
      client.ticket.findMany({
        where: {
          event_id: eventId,
        },
        include: {
          ticket_price_type: {
            include: {
              quote: true,
            },
          },
        },
        orderBy: {
          created_at: "desc"
        },
        skip,
        take: Number(limit),
      }),
    ]);
    return tickets;
  }

  async findById(ticket_id: string): Promise<TicketModel> {
    const ticket = await client.ticket.findFirst({
      where: {
        id: ticket_id,
      },
      include: {
        ticket_price_type: {
          include: {
            quote: true,
          },
        },
        ticket_service_orders: true,
      },
    });
    return ticket;
  }
  async findByEventId(event_id: string): Promise<TicketModel[]> {
    const ticket = await client.ticket.findMany({
      where: {
        event_id,
      },
      include: {
        ticket_price_type: {
          include: {
            quote: true,
          },
        },
      },
    });
    return ticket;
  }

  async findAll(): Promise<TicketModel[]> {
    const ticket = await client.ticket.findMany();
    return ticket;
  }

  async update(data: TicketModel): Promise<TicketModel> {
    const ticket = await client.ticket.update({
      data: {
        category_title: data.category_title,
        description: data.description,
        due_date: data.due_date,
        include_fee: data.include_fee,
        participant_limit: data.participant_limit,
        value: data.value,
        sold: data.sold,
      },
      where: {
        id: data.id,
      },
    });

    return ticket;
  }
  async save(data: TicketModel): Promise<TicketModel> {
    const ticket = await client.ticket.create({
      data: {
        category_title: data.category_title,
        description: data.description,
        due_date: data.due_date,
        include_fee: data.include_fee,
        participant_limit: data.participant_limit,
        value: data.value,
        start_date: data.start_date,
        sold: data.sold,
        event: {
          connect: {
            id: data.event_id,
          },
        },
        ticket_price_type: {
          connect: {
            id: data.ticket_price_type_id,
          },
        },
      },
    });
    return ticket;
  }
}

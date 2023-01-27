import { SessionTicketModel } from "../../models/session-ticket.model";
import { client } from "../../prisma/client";
import { ISessionTicketRepository } from "../interfaces/session-ticket-repository";

export class PrismaSessionTicketRepository implements ISessionTicketRepository {
  async findBySessionIdPaginate({
    sessionId,
    limit,
    page,
  }: {
    sessionId: string;
    page: number;
    limit: number;
  }): Promise<[number, SessionTicketModel[]]> {
    const skip = Math.abs(page - 1) * limit;
    const tickets = await client.$transaction([
      client.sessionTicket.count({
        where: {
          session_id: sessionId,
        },
      }),
      client.sessionTicket.findMany({
        where: {
          session_id: sessionId,
        },
        include: {
          ticket_price_type: {
            include: {
              quote: true,
            },
          },
        },
        orderBy: {
          created_at: "desc",
        },
        skip,
        take: Number(limit),
      }),
    ]);
    return tickets;
  }

  async findById(ticket_id: string): Promise<SessionTicketModel> {
    const ticket = await client.sessionTicket.findFirst({
      where: {
        id: ticket_id,
      },
      include: {
        ticket_price_type: {
          include: {
            quote: true,
          },
        },
        session_ticket_service_orders: true,
      },
    });
    return ticket;
  }
  async findBySessionId(session_id: string): Promise<SessionTicketModel[]> {
    const ticket = await client.sessionTicket.findMany({
      where: {
        session_id,
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

  async findAll(): Promise<SessionTicketModel[]> {
    const ticket = await client.sessionTicket.findMany();
    return ticket;
  }

  async update(data: SessionTicketModel): Promise<SessionTicketModel> {
    const ticket = await client.sessionTicket.update({
      data: {
        participant_limit: data.participant_limit,
        value: data.value,
      },
      where: {
        id: data.id,
      },
    });

    return ticket;
  }
  async save(data: SessionTicketModel): Promise<SessionTicketModel> {
    const ticket = await client.sessionTicket.create({
      data: {
        participant_limit: data.participant_limit,
        value: data.value,
        session: {
          connect: {
            id: data.session_id,
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

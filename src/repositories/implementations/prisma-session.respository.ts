import { SessionModel } from "../../models/session.model";
import { client } from "../../prisma/client";
import { ISessionRepository } from "../interfaces/session-repository";

export class PrismaSessionRepository implements ISessionRepository {
  async findAllBySessionTypeIdPaginate(data: {
    sessionTypeId: string;
    eventId: string;
    page: number;
    limit: number;
  }): Promise<[number, SessionModel[]]> {
    const skip = Math.abs(data.page - 1) * data.limit;
    const sessions = await client.$transaction([
      client.session.count({
        where: {
          session_type_id: data.sessionTypeId,
          event_id: data.eventId,
        },
      }),
      client.session.findMany({
        where: {
          session_type_id: data.sessionTypeId,
          event_id: data.eventId,
        },
        include: {
          session_cover: true,
          event: true,
          session_subscriptions: true,
          session_tickets: true,
          session_type: true,
        },
        skip,
        take: Number(data.limit),
      }),
    ]);
    return sessions;
  }

  async findAllBySessionTypeId(data: {
    sessionTypeId: string;
  }): Promise<SessionModel[]> {
    const sessions = await client.session.findMany({
      where: {
        session_type_id: data.sessionTypeId,
      },
      include: {
        session_cover: true,
        event: true,
        session_subscriptions: true,
        session_tickets: true,
        session_type: true,
      },
    });
    return sessions;
  }
  findById(ticket_id: string): Promise<SessionModel> {
    throw new Error("Method not implemented.");
  }
  async findByEventId(event_id: string): Promise<SessionModel[]> {
    const sessions = await client.session.findMany({
      where: {
        event_id,
      },
      include: {
        session_cover: true,
        event: true,
        session_subscriptions: true,
        session_tickets: true,
        session_type: true,
      },
    });
    return sessions;
  }
  findAll(): Promise<SessionModel[]> {
    throw new Error("Method not implemented.");
  }
  async update(data: SessionModel): Promise<SessionModel> {
    const session = await client.session.update({
      where: {
        id: data.id,
      },
      data: {
        credit_hour: data.credit_hour,
        place: data.place,
        responsible_name: data.responsible_name,
        status: data.status,
        summary: data.summary,
        title: data.title,
        end_date: data.end_date,
        start_date: data.start_date,
      },
      include: {
        session_cover: true,
        event: true,
        session_subscriptions: true,
        session_tickets: true,
        session_type: true,
      },
    });
    return session;
  }
  async save(data: SessionModel): Promise<SessionModel> {
    const session = await client.session.create({
      data: {
        credit_hour: data.credit_hour,
        place: data.place,
        responsible_name: data.responsible_name,
        status: data.status,
        summary: data.summary,
        title: data.title,
        end_date: data.end_date,
        start_date: data.start_date,
        event: {
          connect: {
            id: data.event_id,
          },
        },
        session_type: {
          connect: {
            id: data.session_type_id,
          },
        },
      },
    });
    return session;
  }
}

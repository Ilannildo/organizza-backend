import { SessionDatesModel } from "../../models/session-date.model";
import { client } from "../../prisma/client";
import { ISessionDateRepository } from "../interfaces/session-date-repository";

export class PrismaSessionDateRepository implements ISessionDateRepository {
  findAllMenu(): Promise<SessionDatesModel[]> {
    throw new Error("Method not implemented.");
  }
  findById(data: { session_type_id: string }): Promise<SessionDatesModel> {
    throw new Error("Method not implemented.");
  }
  async findByEventId({
    event_id,
  }: {
    event_id: string;
  }): Promise<SessionDatesModel[]> {
    const dates = await client.sessionDates.findMany({
      where: {
        session: {
          event_id,
        },
      },
      include: {
        session: true,
      },
    });

    return dates;
  }
  update(data: SessionDatesModel): Promise<SessionDatesModel> {
    throw new Error("Method not implemented.");
  }
  save(data: SessionDatesModel): Promise<SessionDatesModel> {
    throw new Error("Method not implemented.");
  }
}

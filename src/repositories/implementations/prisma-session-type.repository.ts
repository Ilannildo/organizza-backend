import { SessionTypeModel } from "../../models/session-type.model";
import { SessionModel } from "../../models/session.model";
import { client } from "../../prisma/client";
import { ISessionTypeRepository } from "../interfaces/session-type-repository";

export class PrismaSessionTypeRespository implements ISessionTypeRepository {
  async findById(data: { session_type_id: string }): Promise<SessionTypeModel> {
    const sessionType = await client.sessionType.findFirst({
      where: {
        id: data.session_type_id,
      },
    });

    return sessionType;
  }
  async findAllMenu(): Promise<SessionTypeModel[]> {
    const sessionTypes = await client.sessionType.findMany({
      where: {
        is_menu: true,
        is_active: true,
      },
    });
    return sessionTypes;
  }
  update(data: SessionModel): Promise<SessionModel> {
    throw new Error("Method not implemented.");
  }
  save(data: SessionModel): Promise<SessionModel> {
    throw new Error("Method not implemented.");
  }
}

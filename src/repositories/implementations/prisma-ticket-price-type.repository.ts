import { TicketPriceTypeModel } from "../../models/ticket-price-type.model";
import { client } from "../../prisma/client";
import { ITicketPriceTypesRepository } from "../interfaces/ticket-price-type-repository";

export class PrismaTicketPriceTypeRepository
  implements ITicketPriceTypesRepository
{
  findById(eventTypeId: string): Promise<TicketPriceTypeModel> {
    throw new Error("Method not implemented.");
  }
  async findAll(): Promise<TicketPriceTypeModel[]> {
    const type = await client.ticketPriceType.findMany({
      include: {
        quote: true,
      },
    });
    return type;
  }
  save(data: TicketPriceTypeModel): Promise<TicketPriceTypeModel> {
    throw new Error("Method not implemented.");
  }
}

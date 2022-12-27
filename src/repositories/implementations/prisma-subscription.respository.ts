import { SubscriptionModel } from "../../models/subscription.model";
import { client } from "../../prisma/client";
import { ISubscriptionRepository } from "../interfaces/susbcription-repository";

export class PrismaSubscriptionRepository implements ISubscriptionRepository {
  findById(ticket_id: string): Promise<SubscriptionModel> {
    throw new Error("Method not implemented.");
  }
  findByEventId(event_id: string): Promise<SubscriptionModel[]> {
    throw new Error("Method not implemented.");
  }
  async findByTicketId(ticket_id: string): Promise<SubscriptionModel[]> {
    const subscription = await client.subscription.findMany({
      where: {
        ticket_service_order: {
          ticket_id: ticket_id,
        },
      },
      include: {
        ticket_service_order: true,
      },
    });
    return subscription;
  }
  findAll(): Promise<SubscriptionModel[]> {
    throw new Error("Method not implemented.");
  }
  update(data: SubscriptionModel): Promise<SubscriptionModel> {
    throw new Error("Method not implemented.");
  }
  save(data: SubscriptionModel): Promise<SubscriptionModel> {
    throw new Error("Method not implemented.");
  }
}

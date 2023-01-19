import { SubscriptionModel } from "../../models/subscription.model";

export interface ISubscriptionRepository {
  findById(subscription_id: string): Promise<SubscriptionModel>;
  findByEventId(event_id: string): Promise<SubscriptionModel[]>;
  findByUserId(data: { userId: string }): Promise<SubscriptionModel[]>;
  findPaginateByUserId(data: {
    userId: string;
    page: number;
    limit: number;
    search: string;
  }): Promise<[number, SubscriptionModel[]]>;
  findByUserAndTicketId(data: {
    userId: string;
    ticketid: string;
  }): Promise<SubscriptionModel[]>;
  findByUserAndEventId(data: {
    userId: string;
    eventId: string;
  }): Promise<SubscriptionModel[]>;
  findByTicketId(ticket_id: string): Promise<SubscriptionModel[]>;
  findOneByTicketId(
    ticket_id: string,
    status: "pending" | "processing" | "completed" | "refused"
  ): Promise<SubscriptionModel>;
  findAll(): Promise<SubscriptionModel[]>;
  update(data: SubscriptionModel): Promise<SubscriptionModel>;
  save(data: SubscriptionModel): Promise<SubscriptionModel>;
}

import { SubscriptionModel } from "../../models/subscription.model";

export interface ISubscriptionRepository {
  findById(ticket_id: string): Promise<SubscriptionModel>;
  findByEventId(event_id: string): Promise<SubscriptionModel[]>;
  findByUserId(data: { userId: string }): Promise<SubscriptionModel[]>;
  findByUserAndTicketId(data: {
    userId: string;
    ticketid: string;
  }): Promise<SubscriptionModel[]>;
  findByUserAndEventId(data: {
    userId: string;
    eventId: string;
  }): Promise<SubscriptionModel[]>;
  findByTicketId(ticket_id: string): Promise<SubscriptionModel[]>;
  findAll(): Promise<SubscriptionModel[]>;
  update(data: SubscriptionModel): Promise<SubscriptionModel>;
  save(data: SubscriptionModel): Promise<SubscriptionModel>;
}

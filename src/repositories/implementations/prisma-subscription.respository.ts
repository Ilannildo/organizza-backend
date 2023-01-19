import { SubscriptionModel } from "../../models/subscription.model";
import { client } from "../../prisma/client";
import { ISubscriptionRepository } from "../interfaces/susbcription-repository";

export class PrismaSubscriptionRepository implements ISubscriptionRepository {
  async findPaginateByUserId({
    limit,
    page,
    userId,
    search,
  }: {
    userId: string;
    page: number;
    limit: number;
    search: string;
  }): Promise<[number, SubscriptionModel[]]> {
    const skip = Math.abs(page - 1) * limit;

    const subscription = await client.$transaction([
      client.subscription.count({
        where: {
          user_id: userId,
          status: {
            not: "refused",
          },
          OR: [
            {
              event: {
                title: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
            {
              code_ref: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        },
      }),
      client.subscription.findMany({
        where: {
          user_id: userId,
          status: {
            not: "refused",
          },
          OR: [
            {
              event: {
                title: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
            {
              code_ref: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        },
        include: {
          ticket_service_order: true,
          event: true,
        },
        orderBy: {
          created_at: "desc",
        },
        skip,
        take: Number(limit),
      }),
    ]);

    return subscription;
  }

  async findByUserAndEventId({
    eventId,
    userId,
  }: {
    userId: string;
    eventId: string;
  }): Promise<SubscriptionModel[]> {
    const subscription = await client.subscription.findMany({
      where: {
        user_id: userId,
        event_id: eventId,
      },
      include: {
        ticket_service_order: true,
      },
    });
    return subscription;
  }

  async findByUserAndTicketId({
    ticketid,
    userId,
  }: {
    userId: string;
    ticketid: string;
  }): Promise<SubscriptionModel[]> {
    const subscription = await client.subscription.findMany({
      where: {
        user_id: userId,
        ticket_service_order: {
          ticket_id: ticketid,
        },
      },
      include: {
        ticket_service_order: true,
      },
    });
    return subscription;
  }

  async findByUserId({
    userId,
  }: {
    userId: string;
  }): Promise<SubscriptionModel[]> {
    const subscription = await client.subscription.findMany({
      where: {
        user_id: userId,
      },
      include: {
        ticket_service_order: true,
      },
    });
    return subscription;
  }

  async findById(subscription_id: string): Promise<SubscriptionModel> {
    const subscription = await client.subscription.findFirst({
      where: {
        id: subscription_id,
      },
      include: {
        ticket_service_order: {
          include: {
            service_order: {
              include: {
                transactions: {
                  include: {
                    payment_method: true,
                  },
                },
              },
            },
            ticket: {
              include: {
                ticket_price_type: true,
              },
            },
          },
        },
        user: true,
        event: true,
      },
    });
    return subscription;
  }
  async findByEventId(event_id: string): Promise<SubscriptionModel[]> {
    const subscription = await client.subscription.findMany({
      where: {
        event_id,
      },
      include: {
        ticket_service_order: true,
      },
    });
    return subscription;
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
  async findOneByTicketId(
    ticket_id: string,
    status: "pending" | "processing" | "completed" | "refused"
  ): Promise<SubscriptionModel> {
    const subscription = await client.subscription.findFirst({
      where: {
        ticket_service_order: {
          ticket_id: ticket_id,
        },
        status,
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
  async update(data: SubscriptionModel): Promise<SubscriptionModel> {
    const sub = await client.subscription.update({
      data: {
        code_ref: data.code_ref,
        status: data.status,
      },
      where: {
        id: data.id,
      },
    });
    return sub;
  }
  async save(data: SubscriptionModel): Promise<SubscriptionModel> {
    const sub = await client.subscription.create({
      data: {
        code_ref: data.code_ref,
        status: data.status,
        ticket_service_order: {
          connect: {
            id: data.ticket_service_order_id,
          },
        },
        event: {
          connect: {
            id: data.event_id,
          },
        },
        user: {
          connect: {
            uid: data.user_id,
          },
        },
      },
    });
    return sub;
  }
}

import { ServiceOrderModel } from "../../models/service-order.model";
import { client } from "../../prisma/client";
import { IServiceOrderRepository } from "../interfaces/service-order-repository";

export class PrismaServiceOrderRepository implements IServiceOrderRepository {
  async update(data: ServiceOrderModel): Promise<ServiceOrderModel> {
    const serviceOrder = await client.serviceOrder.update({
      data: {
        amount_total: data.amount_total,
        expires_in: data.expires_in,
        paid_at: data.paid_at,
        reason_canceled: data.reason_canceled,
        status: data.status,
        type: data.type,
      },
      where: {
        id: data.id,
      },
    });

    return serviceOrder;
  }
  async save(data: ServiceOrderModel): Promise<ServiceOrderModel> {
    const serviceOrder = await client.serviceOrder.create({
      data: {
        amount_total: data.amount_total,
        expires_in: data.expires_in,
        type: data.type,
        status: data.status,
        user: {
          connect: {
            uid: data.user_id,
          },
        },
      },
    });

    return serviceOrder;
  }
}

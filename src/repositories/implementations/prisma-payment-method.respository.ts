import { PaymentMethodModel } from "../../models/payment-method.model";
import { client } from "../../prisma/client";
import { IPaymentMethodRepository } from "../interfaces/payment-method-repository";

export class PrismaPaymentMethodRepository implements IPaymentMethodRepository {
  async findById(payment_method_id: string): Promise<PaymentMethodModel> {
    const payment = await client.paymentMethod.findFirst({
      where: {
        id: payment_method_id,
        status: true,
      },
    });

    return payment;
  }
  async findAll(): Promise<PaymentMethodModel[]> {
    const payments = await client.paymentMethod.findMany({
      where: {
        status: true,
      },
    });

    return payments;
  }
  save(user: PaymentMethodModel): Promise<PaymentMethodModel> {
    throw new Error("Method not implemented.");
  }
}

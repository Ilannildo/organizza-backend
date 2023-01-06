import { TransactionModel } from "../../models/transaction.model";
import { client } from "../../prisma/client";
import { ITransactionRepository } from "../interfaces/transaction-repository";

export class PrismaTransactionRepository implements ITransactionRepository {
  async save(data: TransactionModel): Promise<TransactionModel> {
    const transaction = await client.transaction.create({
      data: {
        customer_document: data.customer_document,
        customer_email: data.customer_email,
        customer_name: data.customer_name,
        customer_phone: data.customer_phone,
        transaction_id: data.transaction_id,
        operation: data.operation,
        status: data.status,
        type: data.type,
        billing_address: data.billing_address,
        billing_city: data.billing_city,
        billing_neighborhood: data.billing_neighborhood,
        billing_number: data.billing_number,
        billing_state: data.billing_state,
        billing_zipcode: data.billing_zipcode,
        processed_response: data.processed_response,
        payment_method: {
          connect: {
            id: data.payment_method_id,
          },
        },
        service_order: {
          connect: {
            id: data.service_order_id,
          },
        },
      },
    });
    return transaction;
  }
  findById(params: { transaction_id: string }): Promise<TransactionModel> {
    throw new Error("Method not implemented.");
  }
  async update(data: TransactionModel): Promise<TransactionModel> {
    const transaction = await client.transaction.update({
      data: {
        customer_document: data.customer_document,
        customer_email: data.customer_email,
        customer_name: data.customer_name,
        customer_phone: data.customer_phone,
        operation: data.operation,
        status: data.status,
        type: data.type,
        billing_address: data.billing_address,
        billing_city: data.billing_city,
        billing_neighborhood: data.billing_neighborhood,
        billing_number: data.billing_number,
        billing_state: data.billing_state,
        billing_zipcode: data.billing_zipcode,
        processed_response: data.processed_response,
        transaction_id: data.transaction_id,
      },
      where: {
        id: data.id,
      },
    });
    return transaction;
  }
}

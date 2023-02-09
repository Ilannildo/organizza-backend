import { TransactionModel } from "../../models/transaction.model";
import { client } from "../../prisma/client";
import { ITransactionRepository } from "../interfaces/transaction-repository";

export class PrismaTransactionRepository implements ITransactionRepository {
  async findByExternalTransactionId(params: {
    transaction_id: string;
  }): Promise<TransactionModel> {
    const transaction = await client.transaction.findFirst({
      where: {
        transaction_id: params.transaction_id,
      },
      include: {
        payment_method: true,
        service_order: {
          include: {
            ticket_service_order: {
              include: {
                ticket: true,
              },
            },
          },
        },
      },
    });
    return transaction;
  }

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

  async findById(params: {
    transaction_id: string;
  }): Promise<TransactionModel> {
    const transaction = await client.transaction.findFirst({
      where: {
        id: params.transaction_id,
      },
      include: {
        payment_method: true,
        service_order: true,
      },
    });
    return transaction;
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

import { TransactionModel } from "../../models/transaction.model";

export interface ITransactionRepository {
  save(data: TransactionModel): Promise<TransactionModel>;
  findById(params: { transaction_id: string }): Promise<TransactionModel>;
  findByExternalTransactionId(params: {
    transaction_id: string;
  }): Promise<TransactionModel>;
  update(data: TransactionModel): Promise<TransactionModel>;
}

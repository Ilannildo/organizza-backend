import { v4 as uuid } from "uuid";
import { TransactionModel } from "./transaction.model";

export class PaymentMethodModel {
  public readonly id: string;
  public payment_form:
    | "open"
    | "processing"
    | "settled"
    | "closed"
    | "canceled";
  public name: string;
  public fee: number;
  public installments: number;
  public status: boolean;
  public created_at?: Date;
  public updated_at?: Date;
  public transactions?: TransactionModel[];

  constructor(props: Omit<PaymentMethodModel, "id">, id?: string) {
    Object.assign(this, props);

    if (!id) {
      this.id = uuid();
    }
  }
}

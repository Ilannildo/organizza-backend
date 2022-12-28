import { v4 as uuid } from "uuid";
import { TransactionModel } from "./transaction.model";

export class PaymentMethodModel {
  public readonly id: string;
  public payment_form:
    | "credit"
    | "debit"
    | "check"
    | "bank_slip"
    | "cash"
    | "deposit"
    | "wallet"
    | "transfer"
    | "pix";
  public name: string;
  public informations?: string;
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

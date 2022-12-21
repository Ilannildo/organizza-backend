import { v4 as uuid } from "uuid";
import { PaymentMethodModel } from "./payment-method.model";
import { ServiceOrderModel } from "./service-order.model";

export class TransactionModel {
  public readonly id: string;
  public payment_method_id: string;
  public service_order_id: string;
  public transaction_id: string;
  public processed_response?: string;
  public customer_email: string;
  public customer_name: string;
  public customer_phone: string;
  public customer_document: string;
  public billing_address?: string;
  public billing_number?: string;
  public billing_neighborhood?: string;
  public billing_city?: string;
  public billing_state?: string;
  public billing_zipcode?: string;
  public operation: "withdraw" | "order";
  public status:
    | "started"
    | "processing"
    | "pending"
    | "approved"
    | "refused"
    | "refunded"
    | "chargeback"
    | "error";
  public type: "input" | "output";
  public created_at?: Date;
  public updated_at?: Date;
  public payment_method?: PaymentMethodModel;
  public service_order?: ServiceOrderModel;

  constructor(props: Omit<TransactionModel, "id">, id?: string) {
    Object.assign(this, props);

    if (!id) {
      this.id = uuid();
    }
  }
}

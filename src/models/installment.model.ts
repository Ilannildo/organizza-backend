import { v4 as uuid } from "uuid";
import { PaymentMethodModel } from "./payment-method.model";

export class InstallmentModel {
  public readonly id: string;
  public title: string;
  public fee: number;
  public number: number;
  public payment_method_id: string;
  public status: boolean;
  public created_at?: Date;
  public updated_at?: Date;
  public payment_method?: PaymentMethodModel;

  constructor(props: Omit<InstallmentModel, "id">, id?: string) {
    Object.assign(this, props);

    if (!id) {
      this.id = uuid();
    }
  }
}

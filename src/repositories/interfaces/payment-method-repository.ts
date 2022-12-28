import { PaymentMethodModel } from "../../models/payment-method.model";

export interface IPaymentMethodRepository {
  findById(payment_method_id: string): Promise<PaymentMethodModel>;
  findAll(): Promise<PaymentMethodModel[]>;
  save(user: PaymentMethodModel): Promise<PaymentMethodModel>;
}

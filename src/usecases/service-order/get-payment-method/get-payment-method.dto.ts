export interface IGetPaymentMethodResponse {
  payment_id: string;
  payment_title: string;
  payment_type:
    | "credit"
    | "debit"
    | "check"
    | "bank_slip"
    | "cash"
    | "deposit"
    | "wallet"
    | "transfer"
    | "pix";
  information: string;
}

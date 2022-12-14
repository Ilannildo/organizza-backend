export interface IPayServiceORderResponse {
  payment_method:
    | "credit"
    | "debit"
    | "check"
    | "bank_slip"
    | "cash"
    | "deposit"
    | "wallet"
    | "transfer"
    | "pix";
  status:
    | "started"
    | "processing"
    | "pending"
    | "approved"
    | "refused"
    | "refunded"
    | "chargeback"
    | "error";
  qr_code_url?: string;
  qr_code?: string;
  expires_at?: Date;
}

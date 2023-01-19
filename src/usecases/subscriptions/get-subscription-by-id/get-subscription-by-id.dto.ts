export interface IGetSubscriptionByIdResponse {
  id: string;
  code: string;
  status: "pending" | "processing" | "completed" | "refused";
  participant: {
    name: string;
    email: string;
  };
  ticket: {
    title: string;
    price: number;
    is_free: boolean;
  };
  event: {
    title: string;
    slug: string;
    place: string;
    start_date: Date;
    end_date: Date;
  };
  summary: {
    code_ref: string;
    payment_method?: string;
    payment_date?: Date;
    subscription_date: Date;
    value?: number;
    fee?: number;
    amount_total?: number;
    status_payment: "open" | "processing" | "settled" | "closed" | "canceled";
  };
}

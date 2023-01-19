export interface IGetUserSubscriptionsResponse {
  id: string;
  code: string;
  event_title: string;
  start_date: Date;
  subscription_date: Date;
  status: "pending" | "processing" | "completed" | "refused";
}

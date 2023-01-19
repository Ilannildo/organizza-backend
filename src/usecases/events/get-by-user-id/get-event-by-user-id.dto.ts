export interface IGetEventByUserIdResponse {
  event_id: string;
  title: string;
  start_date: Date;
  end_date: Date;
  status: "published" | "started" | "finished";
  tickets: number;
}

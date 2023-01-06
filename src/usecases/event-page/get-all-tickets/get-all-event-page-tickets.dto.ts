export interface IGetAllEventPageTicketsResponse {
  ticket_id: string;
  category_title: string;
  description: string;
  available: boolean;
  value: number;
  is_free: boolean;
  status: string;
  due_date: Date;
  due_time: Date;
}

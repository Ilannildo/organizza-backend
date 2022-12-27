export interface IGetAllEventPageSessionsResponse {
  session_id: string;
  title: string;
  summary: string;
  responsible_name: string;
  start_date: Date;
  start_time: Date;
  end_time: Date;
  is_finished: boolean;
  place: string;
}

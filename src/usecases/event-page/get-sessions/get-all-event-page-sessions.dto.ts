export interface IGetAllEventPageSessionsResponse {
  session_id: string;
  title: string;
  summary: string;
  responsible_name: string;
  start_date: Date;
  end_date: Date;
  is_finished: boolean;
  place: string;
}

export interface IEventPageSessionsResponse {
  date: string;
  sessions: IGetAllEventPageSessionsResponse[];
}

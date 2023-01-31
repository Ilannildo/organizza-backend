export interface IGetAllSessionBySessionTypeResponse {
  id: string;
  code_ref?: string;
  title: string;
  start_date: Date;
  end_date: Date;
  value: number;
  status: "published" | "started" | "finished";
  is_free: boolean;
}

export interface IGetEventByIdResponse {
  place: string;
  type: "presential" | "online";
  category: string;
  main_subject: string;
  status: "published" | "started" | "finished";
  is_private: boolean;
  views: number;
}

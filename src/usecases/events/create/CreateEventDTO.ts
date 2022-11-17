import { Response } from "express";

export interface ICreateEventRequestDTO {
  response: Response;
  event: {
    title: string;
    created_by_user_id: string;
    event_type_id: string;
    main_subject_id: string;
    short_description: string;
    venue_type: "presential" | "online";
    is_private: boolean;
    start_date: Date;
    start_time: Date;
    end_date: Date;
    end_time: Date;
    address: string;
    city_id?: string;
    responsible_name: string;
    responsible_email: string;
  };
}

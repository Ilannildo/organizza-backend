export interface IGetEventPageRespose {
  event_id: string;
  title: string;
  short_description: string;
  summary?: string;
  venue_type: "presential" | "online";
  start_date: Date;
  end_date: Date;
  is_finished: boolean;
  event_responsible_name: string;
  event_responsible_email: string;
  event_cover_url?: string;
  logo_url?: string;
  facebook_url?: string;
  instagram_url?: string;
  twitter_url?: string;
}

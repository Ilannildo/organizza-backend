export interface IEventResponse {
  id: string;
  slug: string;
  title: string;
  description: string;
  topic: string;
  start_date: Date;
  end_date: Date;
  attendees: number;
  location: string;
  relevance_score: number;
  type: string;
  cover_url?: string;
}

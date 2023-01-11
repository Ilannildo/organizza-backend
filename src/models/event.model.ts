import { v4 as uuid } from "uuid";
import { EventCoverModel } from "./event-cover.model";
import { EventHasAddressModel } from "./event-has-address.model";
import { EventResponsibleModel } from "./event-responsible.model";
import { EventTypeModel } from "./event-type.model";
import { MainSubjectModel } from "./main-subject.model";
import { SessionModel } from "./session.model";
import { SubscriptionModel } from "./subscription.model";
import { TicketModel } from "./ticket.model";
import { UserModel } from "./user.model";

export class EventModel {
  public readonly id: string;
  public title: string;
  public slug: string;
  public created_by_user_id: string;
  public event_type_id: string;
  public credit_hour?: number;
  public main_subject_id: string;
  public short_description: string;
  public summary?: string;
  public venue_type: "presential" | "online";
  public is_private: boolean;
  public start_date: Date;
  public end_date: Date;
  public logo_url?: string;
  public facebook_url?: string;
  public instagram_url?: string;
  public twitter_url?: string;
  public event_responsible_id: string;
  public status: "published" | "started" | "finished";
  public created_at?: Date;
  public updated_at?: Date;
  public deleted_at?: Date;
  public created_by_user?: UserModel;
  public event_responsible?: EventResponsibleModel;
  public main_subject?: MainSubjectModel;
  public event_type?: EventTypeModel;
  public event_cover?: EventCoverModel;
  public event_has_address?: EventHasAddressModel;
  public sessions?: SessionModel[];
  public tickets?: TicketModel[];
  public subscriptions?: SubscriptionModel[];

  constructor(props: Omit<EventModel, "id">, id?: string) {
    Object.assign(this, props);

    if (!id) {
      this.id = uuid();
    }
  }
}

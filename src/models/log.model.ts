import { v4 as uuid } from "uuid";

export class LogModel {
  public readonly id: string;
  public description?: string;
  public request_method: string;
  public request_url: string;
  public request_headers: string;
  public request_body: string;
  public request_ip: string;
  public response_status: number;
  public response_headers: string;
  public response_body?: string;
  public user_id: string;

  constructor(props: Omit<LogModel, "id">, id?: string) {
    Object.assign(this, props);

    if (!id) {
      this.id = uuid();
    }
  }
}

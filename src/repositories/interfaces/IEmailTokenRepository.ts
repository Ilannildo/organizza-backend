import { EmailTokenModel } from "../../models/email_token.model";

export interface IEmailTokenRepository {
  findById(email_token_id: string): Promise<EmailTokenModel>;
  findByUserId(user_id: string): Promise<EmailTokenModel>;
  save(data: EmailTokenModel): Promise<EmailTokenModel>;
  edit(data: EmailTokenModel): Promise<EmailTokenModel>;
  delete(user_id: string): Promise<boolean>;
}
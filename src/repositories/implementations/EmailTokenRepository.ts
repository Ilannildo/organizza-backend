import { EmailTokenModel } from "../../models/email_token.model";
import { client } from "../../prisma/client";
import { IEmailTokenRepository } from "../interfaces/IEmailTokenRepository";

export class EmailTokenRepository implements IEmailTokenRepository {
  async findById(email_token_id: string): Promise<EmailTokenModel> {
    const email_token = await client.emailToken.findFirst({
      where: {
        id: email_token_id,
      },
      include: {
        user: true,
      },
    });

    return email_token;
  }
  async findByUserId(user_id: string): Promise<EmailTokenModel> {
    const email_token = await client.emailToken.findFirst({
      where: {
        user_id,
      },
      include: {
        user: true,
      },
    });

    return email_token;
  }
  async save(data: EmailTokenModel): Promise<EmailTokenModel> {
    const saved = await client.emailToken.create({
      data: {
        expires_in: data.expires_in,
        user: {
          connect: {
            uid: data.user_id,
          },
        },
      },
      include: {
        user: true,
      },
    });

    return saved;
  }
  delete(user_id: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  async edit(data: EmailTokenModel): Promise<EmailTokenModel> {
    const updated = await client.emailToken.update({
      where: {
        id: data.id,
      },
      data: {
        expires_in: data.expires_in,
        email_sent: data.email_sent,
        email_sent_at: data.email_sent_at,
        user_id: data.user_id,
      },
      include: {
        user: true,
      },
    });

    return updated;
  }
}

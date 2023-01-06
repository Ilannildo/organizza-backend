import { format } from "date-fns";
import { EmailTokenModel } from "../models/email-token.model";
import { IEmailTokenRepository } from "../repositories/interfaces/email-token-repository";
import { SendEmailConfimationProvider } from "./send-email-confimation.provider";

export class EmailTokenProvider {
  constructor(
    private emailTokenRepository: IEmailTokenRepository,
    private sendEmailConfimationProvider: SendEmailConfimationProvider
  ) {}

  async execute(data: EmailTokenModel) {
    const exists = await this.emailTokenRepository.findByUserId(data.user_id);
    const now = new Date();
    if (exists) {
      const expired = new Date(exists.expires_in * 1000);
      if (expired >= now) {
        if (!exists.email_sent) {
          const sending = await this.sendEmailConfimationProvider.execute({
            email: exists.user.email,
            email_token: exists,
            name: exists.user.name,
          });
          if (!sending) {
            throw new Error(
              "Ops! Ocorreu um erro inesperado ao enviar o email de confimarção. Tente novamente!"
            );
          }

          const updated = await this.emailTokenRepository.edit({
            ...exists,
            email_sent: true,
            email_sent_at: new Date(),
          });
          return updated;
        }
        return exists;
      }

      const removed = await this.emailTokenRepository.delete(data.user_id);
      if (!removed) {
        throw new Error("Ops! Ocorreu um erro inesperado. Tente novamente!");
      }
      const created = await this.emailTokenRepository.save(data);

      const sending = await this.sendEmailConfimationProvider.execute({
        email: created.user.email,
        email_token: created,
        name: created.user.name,
      });
      if (!sending) {
        throw new Error(
          "Ops! Ocorreu um erro inesperado ao enviar o email de confimarção. Tente novamente!"
        );
      }

      const updated = await this.emailTokenRepository.edit({
        ...created,
        email_sent: true,
        email_sent_at: new Date(),
      });

      return updated;
    }

    const created = await this.emailTokenRepository.save(data);

    const sending = await this.sendEmailConfimationProvider.execute({
      email: created.user.email,
      email_token: created,
      name: created.user.name,
    });
    if (!sending) {
      throw new Error(
        "Ocorreu um erro inesperado ao enviar o email de confirmação. Tente fazer login!"
      );
    }

    const updated = await this.emailTokenRepository.edit({
      ...created,
      email_sent: true,
      email_sent_at: new Date(),
    });
    return updated;
  }
}

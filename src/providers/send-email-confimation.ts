import { nodeMailerTransporter } from "../config/nodemailer";
import { EmailTokenModel } from "../models/email-token.model";
import { emailConfirmationAccountHtml } from "../utils/templates/email-html/email-confirmation-account";

export class SendEmailConfimation {
  async execute({
    name,
    email,
    email_token,
  }: {
    name: string;
    email: string;
    email_token: EmailTokenModel;
  }) {
    try {
      const base64 = Buffer.from(`${email},${email_token.id}`);
      const confirmationCode = base64.toString("base64");
      const site_url =
        process.env.NODE_ENV === "development"
          ? process.env.SITE_URL_DEV
          : process.env.SITE_URL_PROD;
      const link = `${site_url}/confirmar-cadastro/${confirmationCode}}`;
      await nodeMailerTransporter.sendMail({
        from: "contato@organizza.online",
        to: email,
        subject: "Confirme sua conta",
        html: emailConfirmationAccountHtml({
          link,
          name: name,
        }),
      });
      return true;
    } catch (error) {
      console.log("Error Email", error);
      return false;
    }
  }
}

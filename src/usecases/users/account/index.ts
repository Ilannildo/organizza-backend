import { EmailTokenProvider } from "../../../providers/email-token.provider";
import { SendEmailConfimationProvider } from "../../../providers/send-email-confimation.provider";
import { PrismaEmailTokenRepository } from "../../../repositories/implementations/prisma-email-token.repository";
import { PrismaUserRepository } from "../../../repositories/implementations/prisma-user.respository";
import { UserAccountController } from "./user-account.controller";

const prismaUserRepository = new PrismaUserRepository();
const sendEmailConfimationProvider = new SendEmailConfimationProvider();
const prismaEmailTokenRepository = new PrismaEmailTokenRepository();
const emailTokenProvider = new EmailTokenProvider(
  prismaEmailTokenRepository,
  sendEmailConfimationProvider
);
const userAccountController = new UserAccountController(
  prismaUserRepository,
  emailTokenProvider
);

export { userAccountController };

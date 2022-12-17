import { EmailTokenProvider } from "../../../providers/email-token-provider";
import { SendEmailConfimation } from "../../../providers/send-email-confimation";
import { PrismaEmailTokenRepository } from "../../../repositories/implementations/prisma-email-token.repository";
import { PrismaUserRepository } from "../../../repositories/implementations/prisma-user.respository";
import { UserAccountController } from "./user-account.controller";

const prismaUserRepository = new PrismaUserRepository();
const sendEmailConfimation = new SendEmailConfimation();
const prismaEmailTokenRepository = new PrismaEmailTokenRepository();
const emailTokenProvider = new EmailTokenProvider(
  prismaEmailTokenRepository,
  sendEmailConfimation
);
const userAccountController = new UserAccountController(
  prismaUserRepository,
  emailTokenProvider
);

export { userAccountController };

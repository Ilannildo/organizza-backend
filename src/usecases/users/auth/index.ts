import { EmailTokenProvider } from "../../../providers/email-token-provider";
import { GenerateAccessTokenProvider } from "../../../providers/generate-access-token-provider";
import { SendEmailConfimation } from "../../../providers/send-email-confimation";
import { PrismaEmailTokenRepository } from "../../../repositories/implementations/prisma-email-token.repository";
import { PrismaUserRepository } from "../../../repositories/implementations/prisma-user.respository";
import { AuthenticateUserController } from "./auth-user.controller";

const prismaUserRepository = new PrismaUserRepository();
const prismaEmailTokenRepository = new PrismaEmailTokenRepository();
const sendEmailConfimation = new SendEmailConfimation();
const generateAccessTokenProvider = new GenerateAccessTokenProvider();
const emailTokenProvider = new EmailTokenProvider(
  prismaEmailTokenRepository,
  sendEmailConfimation
);
const authUserController = new AuthenticateUserController(
  prismaUserRepository,
  generateAccessTokenProvider,
  emailTokenProvider
);

export { authUserController };

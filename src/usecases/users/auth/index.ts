import { EmailTokenProvider } from "../../../providers/email-token.provider";
import { GenerateAccessTokenProvider } from "../../../providers/generate-access-token.provider";
import { SendEmailConfimationProvider } from "../../../providers/send-email-confimation.provider";
import { PrismaEmailTokenRepository } from "../../../repositories/implementations/prisma-email-token.repository";
import { PrismaUserRepository } from "../../../repositories/implementations/prisma-user.respository";
import { AuthenticateUserController } from "./auth-user.controller";

const prismaUserRepository = new PrismaUserRepository();
const prismaEmailTokenRepository = new PrismaEmailTokenRepository();
const sendEmailConfimationProvider = new SendEmailConfimationProvider();
const generateAccessTokenProvider = new GenerateAccessTokenProvider();
const emailTokenProvider = new EmailTokenProvider(
  prismaEmailTokenRepository,
  sendEmailConfimationProvider
);
const authUserController = new AuthenticateUserController(
  prismaUserRepository,
  generateAccessTokenProvider,
  emailTokenProvider
);

export { authUserController };

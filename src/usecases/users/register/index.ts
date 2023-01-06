import { EmailTokenProvider } from "../../../providers/email-token.provider";
import { SendEmailConfimationProvider } from "../../../providers/send-email-confimation.provider";
import { PrismaEmailTokenRepository } from "../../../repositories/implementations/prisma-email-token.repository";
import { PrismaRoleRepositroy } from "../../../repositories/implementations/prisma-role.repository";
import { PrismaUserRepository } from "../../../repositories/implementations/prisma-user.respository";
import { RegisterUserController } from "./register-user.controller";

const prismaUserRepository = new PrismaUserRepository();
const prismaRoleRepositroy = new PrismaRoleRepositroy();
const sendEmailConfimationProvider = new SendEmailConfimationProvider();
const prismaEmailTokenRepository = new PrismaEmailTokenRepository();
const emailTokenProvider = new EmailTokenProvider(
  prismaEmailTokenRepository,
  sendEmailConfimationProvider
);
export const registerUserController = new RegisterUserController(
  prismaUserRepository,
  prismaRoleRepositroy,
  emailTokenProvider
);

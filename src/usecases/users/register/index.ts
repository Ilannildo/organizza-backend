import { EmailTokenProvider } from "../../../providers/email-token-provider";
import { SendEmailConfimation } from "../../../providers/send-email-confimation";
import { PrismaEmailTokenRepository } from "../../../repositories/implementations/prisma-email-token.repository";
import { PrismaRoleRepositroy } from "../../../repositories/implementations/prisma-role.repository";
import { PrismaUserRepository } from "../../../repositories/implementations/prisma-user.respository";
import { RegisterUserController } from "./register-user.controller";

const prismaUserRepository = new PrismaUserRepository();
const prismaRoleRepositroy = new PrismaRoleRepositroy();
const sendEmailConfimation = new SendEmailConfimation();
const prismaEmailTokenRepository = new PrismaEmailTokenRepository();
const emailTokenProvider = new EmailTokenProvider(
  prismaEmailTokenRepository,
  sendEmailConfimation
);
export const registerUserController = new RegisterUserController(
  prismaUserRepository,
  prismaRoleRepositroy,
  emailTokenProvider
);

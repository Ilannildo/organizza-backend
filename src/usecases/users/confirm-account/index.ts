import { PrismaEmailTokenRepository } from "../../../repositories/implementations/prisma-email-token.repository";
import { PrismaUserRepository } from "../../../repositories/implementations/prisma-user.respository";
import { ConfirmUserAccountController } from "./confirm-user-account.controller";

const prismaUserRepository = new PrismaUserRepository();
const prismaEmailTokenRepository = new PrismaEmailTokenRepository();
const confirmUserAccountController = new ConfirmUserAccountController(
  prismaUserRepository,
  prismaEmailTokenRepository
);

export { confirmUserAccountController };

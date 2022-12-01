import { EmailTokenRepository } from "../../../repositories/implementations/EmailTokenRepository";
import { UsersRepository } from "../../../repositories/implementations/UsersRespository";
import { ConfirmEmailUserController } from "./ConfirmEmailUserController";

const usersRepository = new UsersRepository();
const emailTokenRepository = new EmailTokenRepository();
const confirmEmailUserController = new ConfirmEmailUserController(
  usersRepository,
  emailTokenRepository
);

export { confirmEmailUserController };

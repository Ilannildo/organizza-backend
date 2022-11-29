import { GenerateAccessTokenProvider } from "../../../providers/GenerateAccessTokenProvider";
import { EmailTokenRepository } from "../../../repositories/implementations/EmailTokenRepository";
import { UsersRepository } from "../../../repositories/implementations/UsersRespository";
import { ConfirmEmailUserController } from "./ConfirmEmailUserController";
import { ConfirmEmailUserUseCase } from "./ConfirmEmailUserUseCase";

const usersRepository = new UsersRepository();
const emailTokenRepository = new EmailTokenRepository();
const confirmEmailUserUseCase = new ConfirmEmailUserUseCase(
  usersRepository,
  emailTokenRepository
);
const confirmEmailUserController = new ConfirmEmailUserController(
  confirmEmailUserUseCase
);

export { confirmEmailUserController };

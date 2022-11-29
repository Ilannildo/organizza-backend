import { EmailTokenProvider } from "../../../providers/EmailTokenProvider";
import { SendEmailConfimation } from "../../../providers/SendEmailConfimation";
import { EmailTokenRepository } from "../../../repositories/implementations/EmailTokenRepository";
import { RoleRepositroy } from "../../../repositories/implementations/RoleRepository";
import { UsersRepository } from "../../../repositories/implementations/UsersRespository";
import { RegisterUserController } from "./RegisterUserController";
import { RegisterUserUseCase } from "./RegisterUserUseCase";

const usersRepository = new UsersRepository();
const rolesRepository = new RoleRepositroy();
const sendEmailConfimation = new SendEmailConfimation();
const emailTokenRepository = new EmailTokenRepository();
const emailTokenProvider = new EmailTokenProvider(
  emailTokenRepository,
  sendEmailConfimation
);
const registerUserUseCase = new RegisterUserUseCase(
  usersRepository,
  rolesRepository,
  emailTokenProvider
);
export const registerUserController = new RegisterUserController(
  registerUserUseCase
);

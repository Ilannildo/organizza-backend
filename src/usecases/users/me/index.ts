import { EmailTokenProvider } from "../../../providers/EmailTokenProvider";
import { GenerateAccessTokenProvider } from "../../../providers/GenerateAccessTokenProvider";
import { SendEmailConfimation } from "../../../providers/SendEmailConfimation";
import { EmailTokenRepository } from "../../../repositories/implementations/EmailTokenRepository";
import { UsersRepository } from "../../../repositories/implementations/UsersRespository";
import { MeUserController } from "./MeUserController";
import { MeUserUseCase } from "./MeUserUseCase";

const usersRepository = new UsersRepository();
const sendEmailConfimation = new SendEmailConfimation();
const emailTokenRepository = new EmailTokenRepository();
const emailTokenProvider = new EmailTokenProvider(
  emailTokenRepository,
  sendEmailConfimation
);
const meUserUseCase = new MeUserUseCase(
  usersRepository,
  emailTokenProvider
);
const meUserController = new MeUserController(meUserUseCase);

export { meUserController };

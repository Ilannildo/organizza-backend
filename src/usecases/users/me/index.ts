import { EmailTokenProvider } from "../../../providers/EmailTokenProvider";
import { SendEmailConfimation } from "../../../providers/SendEmailConfimation";
import { EmailTokenRepository } from "../../../repositories/implementations/EmailTokenRepository";
import { UsersRepository } from "../../../repositories/implementations/UsersRespository";
import { MeUserController } from "./MeUserController";

const usersRepository = new UsersRepository();
const sendEmailConfimation = new SendEmailConfimation();
const emailTokenRepository = new EmailTokenRepository();
const emailTokenProvider = new EmailTokenProvider(
  emailTokenRepository,
  sendEmailConfimation
);
const meUserController = new MeUserController(
  usersRepository,
  emailTokenProvider
);

export { meUserController };

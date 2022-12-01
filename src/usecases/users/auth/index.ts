import { EmailTokenProvider } from "../../../providers/EmailTokenProvider";
import { GenerateAccessTokenProvider } from "../../../providers/GenerateAccessTokenProvider";
import { SendEmailConfimation } from "../../../providers/SendEmailConfimation";
import { EmailTokenRepository } from "../../../repositories/implementations/EmailTokenRepository";
import { UsersRepository } from "../../../repositories/implementations/UsersRespository";
import { AuthenticateUserController } from "./AuthUserController";

const usersRepository = new UsersRepository();
const emailTokenRepository = new EmailTokenRepository();
const sendEmailConfimation = new SendEmailConfimation();
const generateAccessTokenProvider = new GenerateAccessTokenProvider();
const emailTokenProvider = new EmailTokenProvider(
  emailTokenRepository,
  sendEmailConfimation
);
const authUserController = new AuthenticateUserController(
  usersRepository,
  generateAccessTokenProvider,
  emailTokenProvider
);

export { authUserController };

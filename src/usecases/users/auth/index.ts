import { GenerateAccessTokenProvider } from "../../../providers/GenerateAccessTokenProvider";
import { UsersRepository } from "../../../repositories/implementations/UsersRespository";
import { AuthenticateUserController } from "./AuthUserController";
import { AuthUserUseCase } from "./AuthUserUseCase";

const usersRepository = new UsersRepository();
const generateAccessTokenProvider = new GenerateAccessTokenProvider();
const authUserUseCase = new AuthUserUseCase(
  generateAccessTokenProvider,
  usersRepository
);
const authUserController = new AuthenticateUserController(authUserUseCase);

export { authUserController };

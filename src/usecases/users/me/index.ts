import { GenerateAccessTokenProvider } from "../../../providers/GenerateAccessTokenProvider";
import { UsersRepository } from "../../../repositories/implementations/UsersRespository";
import { MeUserController } from "./MeUserController";
import { MeUserUseCase } from "./MeUserUseCase";

const usersRepository = new UsersRepository();
const meUserUseCase = new MeUserUseCase(
  usersRepository
);
const meUserController = new MeUserController(meUserUseCase);

export { meUserController };

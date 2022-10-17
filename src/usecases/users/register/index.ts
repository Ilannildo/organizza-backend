import { UsersRepository } from "../../../repositories/implementations/UsersRespository";
import { RegisterUserController } from "./RegisterUserController";
import { RegisterUserUseCase } from "./RegisterUserUseCase";

const usersRepository = new UsersRepository();
const registerUserUseCase = new RegisterUserUseCase(usersRepository);
export const registerUserController = new RegisterUserController(registerUserUseCase);

import { RoleRepositroy } from "../../../repositories/implementations/RoleRepository";
import { UsersRepository } from "../../../repositories/implementations/UsersRespository";
import { RegisterUserController } from "./RegisterUserController";
import { RegisterUserUseCase } from "./RegisterUserUseCase";

const usersRepository = new UsersRepository();
const rolesRepository = new RoleRepositroy();
const registerUserUseCase = new RegisterUserUseCase(usersRepository, rolesRepository);
export const registerUserController = new RegisterUserController(registerUserUseCase);

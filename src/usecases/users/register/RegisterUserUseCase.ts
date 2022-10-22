import { genSaltSync, hash } from "bcryptjs";
import { UserModel } from "../../../models/user.model";
import { IUsersRepository } from "../../../repositories/interfaces/IUsersrepository";
import { RegisterUserDTO } from "./RegisterUserDTO";

export class RegisterUserUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({ user }: RegisterUserDTO): Promise<UserModel> {
    const userAlreadyExistsByEmail = await this.usersRepository.findByEmail(
      user.email
    );
    if (userAlreadyExistsByEmail) {
      throw new Error("Este email já está cadastrado");
    }

    const passwordHash = await hash(user.password, genSaltSync(10));

    const newUser = new UserModel({
      email: user.email,
      name: user.name,
      password: passwordHash,
      role_id: "e114b470-b9cd-47be-8d32-b72a305e0615",
      status: false,
    });

    const userCreated = await this.usersRepository.save(newUser);
    delete userCreated.password;
    return userCreated;
  }
}

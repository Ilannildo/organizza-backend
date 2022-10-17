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

    const userAlreadyExistsByPhone =
      await this.usersRepository.findByPhoneNumber(user.phone);
    if (userAlreadyExistsByPhone) {
      throw new Error("Este número de telefone já está sendo usado");
    }

    const passwordHash = await hash(user.password, genSaltSync(10));

    const newUser = new UserModel({
      email: user.email,
      gender: user.gender,
      name: user.name,
      name_badge: user.name_badge,
      password: passwordHash,
      phone: user.phone,
      photo_url: null,
      role_id: "84ad9164-582b-48f8-99ad-2fec594056b7",
      status: false,
    });

    const userCreated = await this.usersRepository.save(newUser);
    delete userCreated.password;
    return userCreated;
  }
}

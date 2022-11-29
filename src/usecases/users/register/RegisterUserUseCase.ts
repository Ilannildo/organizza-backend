import { genSaltSync, hash } from "bcryptjs";
import { EmailTokenConfigs } from "../../../config/email_token";
import { EmailTokenModel } from "../../../models/email_token.model";
import { RoleModel, RolesNames } from "../../../models/roles.model";
import { UserModel } from "../../../models/user.model";
import { EmailTokenProvider } from "../../../providers/EmailTokenProvider";
import { IRolesRepository } from "../../../repositories/interfaces/IRolesRepository";
import { IUsersRepository } from "../../../repositories/interfaces/IUsersrepository";
import { RegisterUserDTO } from "./RegisterUserDTO";

export class RegisterUserUseCase {
  constructor(
    private usersRepository: IUsersRepository,
    private rolesRepository: IRolesRepository,
    private emailTokenProvider: EmailTokenProvider
  ) {}

  async execute({ user }: RegisterUserDTO): Promise<UserModel> {
    const userAlreadyExistsByEmail = await this.usersRepository.findByEmail(
      user.email
    );
    if (userAlreadyExistsByEmail) {
      throw new Error("Este email já está cadastrado");
    }

    const passwordHash = await hash(user.password, genSaltSync(10));
    let defaultRole = await this.rolesRepository.findByName(
      RolesNames.ORGANIZER
    );
    if (!defaultRole) {
      const newDefaultRole = new RoleModel({
        name: "ORGANIZER",
        register_user: false,
        delete_user: false,
        edit_user: true,
        view_user: true,
        register_event: true,
        delete_event: false,
        edit_event: true,
        view_event: true,
      });
      defaultRole = await this.rolesRepository.save(newDefaultRole);
    }
    const newUser = new UserModel({
      email: user.email,
      name: user.name,
      password: passwordHash,
      role_id: defaultRole.id,
      status: false,
    });

    const userCreated = await this.usersRepository.save(newUser);
    const newEmailToken = new EmailTokenModel({
      expires_in: EmailTokenConfigs.expires_in,
      user_id: userCreated.uid,
      email_sent: false,
    });

    const emailToken = await this.emailTokenProvider.execute(newEmailToken);
    delete userCreated.password;
    return userCreated;
  }
}

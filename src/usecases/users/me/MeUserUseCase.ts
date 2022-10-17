import { IUsersRepository } from "../../../repositories/interfaces/IUsersrepository";

export class MeUserUseCase {
  constructor(
    private usersRepository: IUsersRepository
  ) {}

  async execute({ uid }: { uid: string }) {
    const userAlreadyExistsById = await this.usersRepository.findById(uid);

    if (!userAlreadyExistsById) {
      throw new Error(
        "Não conseguimos recuperar seus dados. Entre em contato com o suporte"
      );
    }

    if (userAlreadyExistsById.status === false) {
      throw new Error(
        "Sua conta está suspensa. Entre em contato com o administrador"
      );
    }

    delete userAlreadyExistsById.password;
    return userAlreadyExistsById;
  }
}

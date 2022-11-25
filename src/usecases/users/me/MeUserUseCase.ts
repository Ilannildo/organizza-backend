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

    if (!userAlreadyExistsById.email_token) {
      throw new Error("Você ainda não ativou sua conta. Verifique seu email!");
      // TO-DO: Verificar se já foi enviado o email de ativação de conta
      // Verificar se já expirou o link
      // Enviar novo link para o email cadastrado
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

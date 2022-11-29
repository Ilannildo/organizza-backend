import { EmailTokenConfigs } from "../../../config/email_token";
import { EmailTokenModel } from "../../../models/email_token.model";
import { EmailTokenProvider } from "../../../providers/EmailTokenProvider";
import { IUsersRepository } from "../../../repositories/interfaces/IUsersrepository";

export class MeUserUseCase {
  constructor(
    private usersRepository: IUsersRepository,
    private emailTokenProvider: EmailTokenProvider
  ) {}

  async execute({ uid }: { uid: string }) {
    const userAlreadyExistsById = await this.usersRepository.findById(uid);

    if (!userAlreadyExistsById) {
      throw new Error(
        "Não conseguimos recuperar seus dados. Entre em contato com o suporte"
      );
    }

    if (!userAlreadyExistsById.email_verificated_at) {
      const newEmailToken = new EmailTokenModel({
        expires_in: EmailTokenConfigs.expires_in,
        user_id: userAlreadyExistsById.uid,
        email_sent: false,
      });

      const emailToken = await this.emailTokenProvider.execute(newEmailToken);
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

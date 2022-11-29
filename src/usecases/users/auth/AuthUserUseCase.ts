import {
  IAuthenticateUseRequest,
  IAuthenticateUseResponse,
} from "./AuthUserDTO";
import { compare, genSaltSync, hash } from "bcryptjs";
import { GenerateAccessTokenProvider } from "../../../providers/GenerateAccessTokenProvider";
import { IUsersRepository } from "../../../repositories/interfaces/IUsersrepository";
import { EmailTokenProvider } from "../../../providers/EmailTokenProvider";
import { EmailTokenModel } from "../../../models/email_token.model";
import { EmailTokenConfigs } from "../../../config/email_token";

export class AuthUserUseCase {
  constructor(
    private generateAccessTokenProvider: GenerateAccessTokenProvider,
    private usersRepository: IUsersRepository,
    private emailTokenProvider: EmailTokenProvider
  ) {}

  async execute({
    email,
    password,
  }: IAuthenticateUseRequest): Promise<IAuthenticateUseResponse> {
    const userAlreadyExistsByEmail = await this.usersRepository.findByEmail(
      email
    );

    if (!userAlreadyExistsByEmail) {
      throw new Error("Ops! Verifique suas credenciais e tente novamente");
    }

    if (!userAlreadyExistsByEmail.email_verificated_at) {
      const newEmailToken = new EmailTokenModel({
        expires_in: EmailTokenConfigs.expires_in,
        user_id: userAlreadyExistsByEmail.uid,
        email_sent: false,
      });

      const emailToken = await this.emailTokenProvider.execute(newEmailToken);

      throw new Error("Você ainda não ativou sua conta. Verifique seu email!");
      // TO-DO: Verificar se já foi enviado o email de ativação de conta
      // Verificar se já expirou o link
      // Enviar novo link para o email cadastrado
    }

    if (userAlreadyExistsByEmail.status === false) {
      throw new Error(
        "Sua conta está desativada. Entre em contato com o administrador"
      );
    }

    const passwordHash = await hash(password, genSaltSync(10));

    const passwordMatch = await compare(
      password,
      userAlreadyExistsByEmail.password
    );

    if (!passwordMatch) {
      throw new Error("Ops! Verifique suas credenciais e tente novamente");
    }

    const accessToken = this.generateAccessTokenProvider.execute(
      userAlreadyExistsByEmail.uid
    );

    delete userAlreadyExistsByEmail.password;
    return { access_token: accessToken, user: userAlreadyExistsByEmail };
  }
}

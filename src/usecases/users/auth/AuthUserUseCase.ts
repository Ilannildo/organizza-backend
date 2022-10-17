import {
  IAuthenticateUseRequest,
  IAuthenticateUseResponse,
} from "./AuthUserDTO";
import { compare } from "bcryptjs";
import { GenerateAccessTokenProvider } from "../../../providers/GenerateAccessTokenProvider";
import { IUsersRepository } from "../../../repositories/interfaces/IUsersrepository";

export class AuthUserUseCase {
  constructor(
    private generateAccessTokenProvider: GenerateAccessTokenProvider,
    private usersRepository: IUsersRepository
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

    if (userAlreadyExistsByEmail.status === false) {
      throw new Error(
        "Sua conta está suspensa. Entre em contato com o administrador"
      );
    }

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

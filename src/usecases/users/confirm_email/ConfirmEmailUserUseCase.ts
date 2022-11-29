import { IEmailTokenRepository } from "../../../repositories/interfaces/IEmailTokenRepository";
import { IUsersRepository } from "../../../repositories/interfaces/IUsersrepository";

export class ConfirmEmailUserUseCase {
  constructor(
    private usersRepository: IUsersRepository,
    private emailTokenRepository: IEmailTokenRepository
  ) {}

  async execute({ code }: { code: string }) {
    const base64Decode = Buffer.from(code, "base64");
    const decodedConfirmCode = base64Decode.toString();
    console.log("base64 >>>>", decodedConfirmCode);
    const split = decodedConfirmCode.split(",");
    if (split.length !== 2) {
      throw new Error("Código de confirmação inválido");
    }

    const userEmail = split[0];
    const emailTokenId = split[1];

    const emailTokenAlreadyExistsById =
      await this.emailTokenRepository.findById(emailTokenId);

    if (!emailTokenAlreadyExistsById) {
      throw new Error(
        "Esse link não é válido"
      );
    }

    if (emailTokenAlreadyExistsById.user.email !== userEmail) {
      throw new Error("Esse link não é válido");
    }

    const expired = new Date(emailTokenAlreadyExistsById.expires_in * 1000);
    if (expired < new Date()) {
      throw new Error("Esse link está expirado");
    }

    const userActived = await this.usersRepository.findById(emailTokenAlreadyExistsById.user_id);

    if(userActived.status) {
      throw new Error("Esse link já foi utilizado");
    }

    const userUpdated = await this.usersRepository.confirmEmail(
      emailTokenAlreadyExistsById.user_id
    );

    userUpdated.password;
    return userUpdated;
  }
}

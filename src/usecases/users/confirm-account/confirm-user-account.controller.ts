import { Request, Response } from "express";
import { IEmailTokenRepository } from "../../../repositories/interfaces/email-token-repository";
import { IUsersRepository } from "../../../repositories/interfaces/user-repository";
import * as responses from "../../../utils/formatters/responses";
import { HttpStatus } from "../../../utils/httpStatus";
import { Codes } from "../../../utils/codes";

export class ConfirmUserAccountController {
  constructor(
    private usersRepository: IUsersRepository,
    private emailTokenRepository: IEmailTokenRepository
  ) {}

  async handle(request: Request, response: Response) {
    const { code } = request.body;
    try {
      const base64Decode = Buffer.from(code, "base64");
      const decodedConfirmCode = base64Decode.toString();
      const split = decodedConfirmCode.split(",");
      if (split.length !== 2) {
        return responses.sendError(
          response,
          Codes.AUTH__INVALID_RESET_CODE,
          "Link inválido",
          HttpStatus.UNPROCESSABLE_ENTITY
        );
      }

      const userEmail = split[0];
      const emailTokenId = split[1];

      const emailTokenAlreadyExistsById =
        await this.emailTokenRepository.findById(emailTokenId);

      if (!emailTokenAlreadyExistsById) {
        return responses.sendError(
          response,
          Codes.AUTH__INVALID_RESET_CODE,
          "Esse link não é válido",
          HttpStatus.UNPROCESSABLE_ENTITY
        );
      }

      if (emailTokenAlreadyExistsById.user.email !== userEmail) {
        return responses.sendError(
          response,
          Codes.AUTH__INVALID_RESET_CODE,
          "Esse link não é válido",
          HttpStatus.UNPROCESSABLE_ENTITY
        );
      }

      const expired = new Date(emailTokenAlreadyExistsById.expires_in * 1000);
      if (expired < new Date()) {
        return responses.sendError(
          response,
          Codes.AUTH__USER_TOKEN_EXPIRED,
          "Esse link está expirado",
          HttpStatus.UNPROCESSABLE_ENTITY
        );
      }

      const userActived = await this.usersRepository.findById(
        emailTokenAlreadyExistsById.user_id
      );

      if (userActived.status) {
        return responses.sendError(
          response,
          Codes.AUTH__USER_TOKEN_EXPIRED,
          "Esse link está expirado",
          HttpStatus.UNPROCESSABLE_ENTITY
        );
      }

      await this.usersRepository.confirmEmail(
        emailTokenAlreadyExistsById.user_id
      );

      return responses.sendSuccessful(response, {}, HttpStatus.NO_CONTENT);
    } catch (error) {
      return responses.sendError(
        response,
        Codes.UNKNOWN_ERROR,
        error.message || "Unexpected error",
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }
  }
}

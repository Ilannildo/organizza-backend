import { Request, Response } from "express";
import { IUsersRepository } from "../../../repositories/interfaces/user-repository";
import { EmailTokenProvider } from "../../../providers/email-token.provider";
import { EmailTokenModel } from "../../../models/email-token.model";
import * as responses from "../../../utils/formatters/responses";
import { EmailConfigs } from "../../../config/email";
import { HttpStatus } from "../../../utils/httpStatus";
import { RequestWithAuth } from "../../../utils/types";
import { Codes } from "../../../utils/codes";

export class UserAccountController {
  constructor(
    private usersRepository: IUsersRepository,
    private emailTokenProvider: EmailTokenProvider
  ) {}

  async handle(request: RequestWithAuth, response: Response) {
    try {
      const user_id = request.user.uid;
      const userAlreadyExistsById = await this.usersRepository.findById(
        user_id
      );

      if (!userAlreadyExistsById) {
        return responses.sendError(
          response,
          Codes.USER__NOT_FOUND,
          "Não conseguimos recuperar seus dados. Entre em contato com o suporte",
          HttpStatus.UNPROCESSABLE_ENTITY
        );
      }

      if (!userAlreadyExistsById.email_verificated_at) {
        const newEmailToken = new EmailTokenModel({
          expires_in: EmailConfigs.expires_in,
          user_id: userAlreadyExistsById.uid,
          email_sent: false,
        });

        await this.emailTokenProvider.execute(newEmailToken);

        return responses.sendError(
          response,
          Codes.AUTH__USER_DISABLED,
          "Você ainda não ativou sua conta. Verifique seu email!",
          HttpStatus.UNAUTHORIZED
        );
      }

      if (userAlreadyExistsById.status === false) {
        return responses.sendError(
          response,
          Codes.AUTH__USER_DISABLED,
          "Sua conta está suspensa. Entre em contato com o administrador",
          HttpStatus.UNAUTHORIZED
        );
      }

      delete userAlreadyExistsById.password;
      return responses.sendSuccessful(response, userAlreadyExistsById);
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

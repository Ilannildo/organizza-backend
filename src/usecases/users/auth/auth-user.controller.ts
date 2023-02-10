import { compare } from "bcryptjs";
import { Request, Response } from "express";

import { EmailConfigs } from "../../../config/email";
import { EmailTokenModel } from "../../../models/email-token.model";
import { EmailTokenProvider } from "../../../providers/email-token.provider";
import { GenerateAccessTokenProvider } from "../../../providers/generate-access-token.provider";
import { IUsersRepository } from "../../../repositories/interfaces/user-repository";
import { Codes } from "../../../utils/codes";
import { HttpStatus } from "../../../utils/httpStatus";

import * as responses from "../../../utils/formatters/responses";
import { logRequest } from "../../../utils/middlewares/log";

export class AuthenticateUserController {
  constructor(
    private usersRepository: IUsersRepository,
    private generateAccessTokenProvider: GenerateAccessTokenProvider,
    private emailTokenProvider: EmailTokenProvider
  ) {}

  async handle(request: Request, response: Response) {
    const { email, password } = request.body;

    try {
      const userAlreadyExistsByEmail = await this.usersRepository.findByEmail(
        email
      );

      if (!userAlreadyExistsByEmail) {
        return responses.sendError(
          response,
          Codes.AUTH__UNEXPECTED_AUTHORIZATION,
          "Verifique suas credenciais e tente novamente",
          HttpStatus.UNAUTHORIZED
        );
      }

      if (!userAlreadyExistsByEmail.email_verificated_at) {
        const newEmailToken = new EmailTokenModel({
          expires_in: EmailConfigs.expires_in,
          user_id: userAlreadyExistsByEmail.uid,
          email_sent: false,
        });

        const emailToken = await this.emailTokenProvider.execute(newEmailToken);

        return responses.sendError(
          response,
          Codes.AUTH__USER_DISABLED,
          "Você ainda não ativou sua conta. Verifique seu email!",
          HttpStatus.UNAUTHORIZED
        );
      }

      if (userAlreadyExistsByEmail.status === false) {
        return responses.sendError(
          response,
          Codes.AUTH__USER_DISABLED,
          "Sua conta está desativada. Entre em contato com o administrador",
          HttpStatus.UNAUTHORIZED
        );
      }

      const passwordMatch = await compare(
        password,
        userAlreadyExistsByEmail.password
      );

      if (!passwordMatch) {
        return responses.sendError(
          response,
          Codes.AUTH__UNEXPECTED_AUTHORIZATION,
          "Verifique suas credenciais e tente novamente",
          HttpStatus.UNAUTHORIZED
        );
      }

      const accessToken = this.generateAccessTokenProvider.execute(
        userAlreadyExistsByEmail.uid
      );

      delete userAlreadyExistsByEmail.password;

      // create log to login
      await logRequest({
        request,
        response,
        user_id: userAlreadyExistsByEmail.uid,
        description: "AUTH LOGIN",
        response_body: {
          access_token: accessToken,
        },
      });

      return responses.sendSuccessful(response, {
        access_token: accessToken,
      });
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

import { Request, Response } from "express";
import { EmailTokenProvider } from "../../../providers/email-token.provider";
import { IRolesRepository } from "../../../repositories/interfaces/role-repository";
import { IUsersRepository } from "../../../repositories/interfaces/user-repository";
import * as responses from "../../../utils/formatters/responses";
import { HttpStatus } from "../../../utils/httpStatus";
import { Codes } from "../../../utils/codes";
import { genSaltSync, hash } from "bcryptjs";
import { RoleModel, RolesNames } from "../../../models/roles.model";
import { UserModel } from "../../../models/user.model";
import { EmailTokenModel } from "../../../models/email-token.model";
import { EmailConfigs } from "../../../config/email";

export class RegisterUserController {
  constructor(
    private usersRepository: IUsersRepository,
    private rolesRepository: IRolesRepository,
    private emailTokenProvider: EmailTokenProvider
  ) {}

  async handle(request: Request, response: Response) {
    const { email, name, password } = request.body;

    try {
      const userAlreadyExistsByEmail = await this.usersRepository.findByEmail(
        email
      );
      if (userAlreadyExistsByEmail) {
        return responses.sendError(
          response,
          Codes.AUTH__EMAIL_ALREADY_IN_USE,
          "Este email já está cadastrado",
          HttpStatus.UNPROCESSABLE_ENTITY
        );
      }

      const passwordHash = await hash(password, genSaltSync(10));
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
          delete_service_order: false,
          delete_session: false,
          delete_ticket: true,
          edit_service_order: true,
          edit_session: true,
          edit_ticket: true,
          register_service_order: true,
          register_session: true,
          register_ticket: true,
          view_service_order: true,
          view_session: true,
          view_ticket: true,
        });
        defaultRole = await this.rolesRepository.save(newDefaultRole);
      }
      const newUser = new UserModel({
        email,
        name,
        password: passwordHash,
        role_id: defaultRole.id,
        status: false,
      });

      const userCreated = await this.usersRepository.save(newUser);
      const newEmailToken = new EmailTokenModel({
        expires_in: EmailConfigs.expires_in,
        user_id: userCreated.uid,
        email_sent: false,
      });

      await this.emailTokenProvider.execute(newEmailToken);
      return responses.sendSuccessful(response, {});
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

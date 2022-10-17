import aclConstructor from "acl";
import { NextFunction, Request, Response } from "express";

import * as responses from "../../../../../utils/formatters/responses";
import { HttpStatus } from "../../../../../utils/httpStatus";
import { Codes } from "../../../../../utils/codes";
import { UserDI } from "../../interfaces/user.interface";
import { POLICY_ROLES, roleToPolicy } from "../../../../../utils/roleToPolicy";

// Using the memory backend
// console.log(aclConstructor);
const acl = new aclConstructor(new aclConstructor.memoryBackend());

/**
 * Invoke Users Permissions
 */
export function invokeRolesPolicies() {
  acl.allow([
    {
      roles: [POLICY_ROLES.ANY],
      allows: [
        {
          resources: "/api/me",
          permissions: ["get"],
        },
      ],
    },
    {
      roles: [POLICY_ROLES.REGISTER_USER],
      allows: [
        {
          resources: "/api/users",
          permissions: ["post"],
        },
      ],
    },
    {
      roles: [POLICY_ROLES.DELETE_USER],
      allows: [
        {
          resources: "/api/users",
          permissions: ["delete"],
        },
      ],
    },
    {
      roles: [POLICY_ROLES.EDIT_USER],
      allows: [
        {
          resources: "/api/users",
          permissions: ["put"],
        },
      ],
    },
    {
      roles: [POLICY_ROLES.VIEW_USER],
      allows: [
        {
          resources: "/api/users",
          permissions: ["get"],
        },
      ],
    },
    {
      roles: [POLICY_ROLES.REGISTER_EVENT],
      allows: [
        {
          resources: "/api/events",
          permissions: ["post"],
        },
      ],
    },
    {
      roles: [POLICY_ROLES.DELETE_EVENT],
      allows: [
        {
          resources: "/api/events",
          permissions: ["delete"],
        },
      ],
    },
    {
      roles: [POLICY_ROLES.EDIT_EVENT],
      allows: [
        {
          resources: "/api/events",
          permissions: ["put"],
        },
      ],
    },
    {
      roles: [POLICY_ROLES.VIEW_EVENT],
      allows: [
        {
          resources: "/api/events",
          permissions: ["get"],
        },
      ],
    },
  ]);
}

export function isAllowed(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const user = request.user as UserDI;
  const roles = user ? roleToPolicy(user.role) : ["guest"];
  const { user_id } = request.params;
  console.log("Roles", roles);

  if (user && user_id && user.matchesId(user_id)) {
    return next();
  }

  acl.areAnyRolesAllowed(
    roles,
    request.route.path,
    request.method.toLowerCase(),
    (err, isAllowed) => {
      if (err) {
        return responses.sendError(
          response,
          Codes.AUTH__UNEXPECTED_AUTHORIZATION,
          "Internal server error",
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      } else {
        if (isAllowed) {
          // Access granted! Invoke next middleware
          return next();
        } else {
          return responses.sendError(
            response,
            Codes.AUTH__USER_NOT_AUTHORIZED,
            "Você não tem autorização suficiente",
            HttpStatus.FORBIDDEN
          );
        }
      }
    }
  );
}

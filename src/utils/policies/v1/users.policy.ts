import aclConstructor from "acl";
import { NextFunction, Request, Response } from "express";

import * as responses from "../../formatters/responses";
import { HttpStatus } from "../../httpStatus";
import { Codes } from "../../codes";
import { UserDI } from "../../interfaces/user.interface";
import { POLICY_ROLES, roleToPolicy } from "../../roleToPolicy";

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
          resources: "/api/users/account",
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
      roles: [POLICY_ROLES.REGISTER_EVENT],
      allows: [
        {
          resources: "/api/events/:event_id/cover",
          permissions: ["post"],
        },
      ],
    },
    {
      roles: [POLICY_ROLES.REGISTER_EVENT],
      allows: [
        {
          resources: "/api/users/events",
          permissions: ["get"],
        },
      ],
    },
    {
      roles: [POLICY_ROLES.REGISTER_TICKET],
      allows: [
        {
          resources: "/api/events/:event_id/tickets",
          permissions: ["post"],
        },
      ],
    },
    {
      roles: [POLICY_ROLES.VIEW_TICKET],
      allows: [
        {
          resources: "/api/events/:event_id/tickets",
          permissions: ["get"],
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
      roles: [POLICY_ROLES.EDIT_EVENT],
      allows: [
        {
          resources: "/api/events/:event_id",
          permissions: ["get"],
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
    {
      roles: [POLICY_ROLES.REGISTER_SERVICE_ORDER],
      allows: [
        {
          resources: "/api/service-orders/tickets",
          permissions: ["post"],
        },
        {
          resources: "/api/service-orders/:service_order_id/pay",
          permissions: ["post"],
        },
      ],
    },
    {
      roles: [POLICY_ROLES.EDIT_SERVICE_ORDER],
      allows: [
        {
          resources: "/api/service-orders/:order_id/close",
          permissions: ["put"],
        },
      ],
    },
    {
      roles: [POLICY_ROLES.VIEW_SERVICE_ORDER],
      allows: [
        {
          resources: "/api/service-orders/:service_order_id",
          permissions: ["get"],
        },
      ],
    },
    {
      roles: [POLICY_ROLES.REGISTER_SESSION],
      allows: [
        {
          resources: "/api/events/:event_id/sessions",
          permissions: ["post"],
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

  if (user && user_id && user.matchesId(user_id)) {
    return next();
  }

  const path = `${request.baseUrl}${request.route.path}`;
  console.log("LOG AUTH PATH >>>", path);

  acl.areAnyRolesAllowed(
    roles,
    path,
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

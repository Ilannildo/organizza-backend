import { RoleModel } from "../models/roles.model";

export enum POLICY_ROLES {
  ANY = "any",
  REGISTER_USER = "register_user",
  DELETE_USER = "delete_user",
  EDIT_USER = "edit_user",
  VIEW_USER = "view_user",
  REGISTER_EVENT = "register_event",
  DELETE_EVENT = "delete_event",
  EDIT_EVENT = "edit_event",
  VIEW_EVENT = "view_event",
  REGISTER_SERVICE_ORDER = "register_service_order",
  DELETE_SERVICE_ORDER = "delete_service_order",
  EDIT_SERVICE_ORDER = "edit_service_order",
  VIEW_SERVICE_ORDER = "view_service_order",
  REGISTER_TICKET = "register_ticket",
  DELETE_TICKET = "delete_ticket",
  EDIT_TICKET = "edit_ticket",
  VIEW_TICKET = "view_ticket",
  REGISTER_SESSION = "register_session",
  DELETE_SESSION = "delete_session",
  EDIT_SESSION = "edit_session",
  VIEW_SESSION = "view_session",
}

export function roleToPolicy(role?: RoleModel) {
  const roles = [POLICY_ROLES.ANY];
  if (role) {
    if (role.register_user) {
      roles.push(POLICY_ROLES.REGISTER_USER);
    }
    if (role.edit_user) {
      roles.push(POLICY_ROLES.EDIT_USER);
    }
    if (role.delete_user) {
      roles.push(POLICY_ROLES.DELETE_USER);
    }
    if (role.view_user) {
      roles.push(POLICY_ROLES.VIEW_USER);
    }
    if (role.register_event) {
      roles.push(POLICY_ROLES.REGISTER_EVENT);
    }
    if (role.edit_event) {
      roles.push(POLICY_ROLES.EDIT_EVENT);
    }
    if (role.delete_event) {
      roles.push(POLICY_ROLES.DELETE_EVENT);
    }
    if (role.view_event) {
      roles.push(POLICY_ROLES.VIEW_EVENT);
    }
    if (role.register_service_order) {
      roles.push(POLICY_ROLES.REGISTER_SERVICE_ORDER);
    }
    if (role.edit_service_order) {
      roles.push(POLICY_ROLES.EDIT_SERVICE_ORDER);
    }
    if (role.delete_service_order) {
      roles.push(POLICY_ROLES.DELETE_SERVICE_ORDER);
    }
    if (role.view_service_order) {
      roles.push(POLICY_ROLES.VIEW_SERVICE_ORDER);
    }
    if (role.register_ticket) {
      roles.push(POLICY_ROLES.REGISTER_TICKET);
    }
    if (role.edit_ticket) {
      roles.push(POLICY_ROLES.EDIT_TICKET);
    }
    if (role.delete_ticket) {
      roles.push(POLICY_ROLES.DELETE_TICKET);
    }
    if (role.view_ticket) {
      roles.push(POLICY_ROLES.VIEW_TICKET);
    }
    if (role.register_session) {
      roles.push(POLICY_ROLES.REGISTER_SESSION);
    }
    if (role.edit_session) {
      roles.push(POLICY_ROLES.EDIT_SESSION);
    }
    if (role.delete_session) {
      roles.push(POLICY_ROLES.DELETE_SESSION);
    }
    if (role.view_session) {
      roles.push(POLICY_ROLES.VIEW_SESSION);
    }
  }
  return roles;
}

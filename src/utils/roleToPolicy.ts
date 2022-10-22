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
 
}

export function roleToPolicy(role?: RoleModel) {
  const roles = [POLICY_ROLES.ANY];
  if(role) {
    if(role.register_user) {
      roles.push(POLICY_ROLES.REGISTER_USER);
    }
    if(role.edit_user) {
      roles.push(POLICY_ROLES.EDIT_USER);
    }
    if(role.delete_user) {
      roles.push(POLICY_ROLES.DELETE_USER);
    }
    if(role.view_user) {
      roles.push(POLICY_ROLES.VIEW_USER);
    }
    if(role.register_event) {
      roles.push(POLICY_ROLES.REGISTER_EVENT);
    }
    if(role.edit_event) {
      roles.push(POLICY_ROLES.EDIT_EVENT);
    }
    if(role.delete_event) {
      roles.push(POLICY_ROLES.DELETE_EVENT);
    }
    if(role.view_event) {
      roles.push(POLICY_ROLES.VIEW_EVENT);
    }
  }
  return roles;
}
import { IDocument } from "./document";

/**
 * User Roles
 */
export enum UserRole {
  "admin" = "admin",
  "coach" = "coach",
  "director" = "director",
  "manager" = "manager",
  "player" = "player",
}

/**
 * User
 */
export interface IUser extends IDocument {
  firstName: string;
  lastName: string;
  role: UserRole;
  active: boolean;
}

/**
 * Add director user
 */
export interface IDirector{
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface IDirectorItem{
  firstName: string;
  lastName: string;
  email: string;
  login: {email: string}
}



export interface IUserContext {
  token: string | null;
  info: IUser | null;
}
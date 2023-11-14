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

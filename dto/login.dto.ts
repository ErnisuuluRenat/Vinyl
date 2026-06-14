import { User } from "../models/user.model";

export type LoginUserDto = Pick<User, "password" | "username">

export type UserCredentials = Pick<User, "id" | "password">
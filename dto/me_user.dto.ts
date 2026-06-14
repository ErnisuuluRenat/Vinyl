import { User } from "../models/user.model";

export type MeUserDto = Omit<User, 'password'>
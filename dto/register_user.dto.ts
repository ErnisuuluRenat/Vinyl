import { User } from "../models/user.model";

export type RegisterUserDto = Omit<User, "id">
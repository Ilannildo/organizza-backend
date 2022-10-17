import { User } from "../../models/User";

export interface IUsersRepository {
  findById(user_id: string): Promise<User>;
  findByEmail(email: string): Promise<User>;
  findAll(): Promise<User[]>;
  save(user: User): Promise<User>;
}
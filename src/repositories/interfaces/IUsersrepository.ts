import { UserModel } from "../../models/user.model";

export interface IUsersRepository {
  findById(user_id: string): Promise<UserModel>;
  findByEmail(email: string): Promise<UserModel>;
  findByPhoneNumber(phone: string): Promise<UserModel>;
  findAll(): Promise<UserModel[]>;
  save(user: UserModel): Promise<UserModel>;
}
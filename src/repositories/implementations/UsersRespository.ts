import { UserModel } from "../../models/user.model";
import { client } from "../../prisma/client";
import { IUsersRepository } from "../interfaces/IUsersrepository";

export class UsersRepository implements IUsersRepository {
  async findById(user_id: string): Promise<UserModel> {
    const user = await client.user.findFirst({
      where: {
        uid: user_id,
        deleted_at: null,
      },
      include: {
        role: true,
        user_has_address: {
          include: {
            address: true,
          },
        },
      },
    });

    return user;
  }
  async findByEmail(email: string): Promise<UserModel> {
    const user = await client.user.findFirst({
      where: {
        email: email,
        deleted_at: null,
      },
      include: {
        role: true,
        user_has_address: {
          include: {
            address: true,
          },
        },
      },
    });

    return user;
  }
  async findAll(): Promise<UserModel[]> {
    const users = await client.user.findMany({
      where: {
        deleted_at: null,
      },
      include: {
        role: true,
        user_has_address: {
          include: {
            address: true,
          },
        },
      },
    });

    return users;
  }

  async findByPhoneNumber(phone: string): Promise<UserModel> {
    const userPhone = await client.user.findFirst({
      where: {
        phone,
      },
      include: {
        role: true,
        user_has_address: {
          include: {
            address: true,
          },
        },
      },
    });
    return userPhone;
  }

  async save(user: UserModel): Promise<UserModel> {
    const userCreated = await client.user.create({
      data: user,
    });

    return userCreated;
  }
}

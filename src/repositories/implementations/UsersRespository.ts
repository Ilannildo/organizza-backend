import { User } from "../../models/User";
import { client } from "../../prisma/client";
import { IUsersRepository } from "../interfaces/IUsersrepository";

export class UsersRepository implements IUsersRepository {
  async findById(user_id: string): Promise<User> {
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
  async findByEmail(email: string): Promise<User> {
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
  async findAll(): Promise<User[]> {
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
  async save(user: User): Promise<User> {
    const userCreated = await client.user.create({
      data: user,
    });

    return userCreated;
  }
}

import { UserModel } from "../../models/user.model";
import { client } from "../../prisma/client";
import { IUsersRepository } from "../interfaces/user-repository";

export class PrismaUserRepository implements IUsersRepository {
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
        recipient: true,
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
        recipient: true,
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
        recipient: true,
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
        recipient: true,
      },
    });
    return userPhone;
  }

  async save(user: UserModel): Promise<UserModel> {
    const userCreated = await client.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
        phone: user.phone,
        role: {
          connect: {
            id: user.role_id,
          },
        },
      },
    });

    return userCreated;
  }

  async confirmEmail(user_id: string): Promise<UserModel> {
    const user = await client.user.update({
      where: {
        uid: user_id,
      },
      data: {
        status: true,
        email_verificated_at: new Date(),
      },
    });

    return user;
  }
}

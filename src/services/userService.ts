import { Prisma, User } from '@prisma/client';
import { BaseService } from './baseService';
import { db } from '../utils/db.server';
import { hashPassword } from '../utils/helpers';

export class UserService extends BaseService<User, Prisma.UserCreateInput, Prisma.UserUpdateInput> {
  constructor() {
    super(db, db.user);
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    // Hash the password if provided
    if (data.ownerId) {
      const ownerExists = await db.owner.findUnique({
        where: { id: data.ownerId },
      });

      if (!ownerExists) {
        throw new Error(`Owner with id ${data.ownerId} does not exist`);
      }
    }
    if (data.password) {
      data.password = await hashPassword(data.password);
    }
    return super.create(data);
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    // Hash the password if provided
    if (data.password) {
      data.password = await hashPassword(data.password);
    }
    return super.create(data);
  }

  async getByEmail(email: string, ownerId: number): Promise<User | null> {
    try {
      return await db.user.findUnique({
        where: {
          email_ownerId: {
            email,
            ownerId,
          },
        },
      });
    } catch (error: any) {
      throw new Error(`Error obteniendo el usuario: ${error.message}`);
    }
  }

  async getUsersByTenant(ownerId: number): Promise<User[]> {
    try {
      return await db.user.findMany({
        where: { ownerId },
      });
    } catch (error: any) {
      throw new Error(`Error obteniendo los usuarios por tenant: ${error.message}`);
    }
  }

  // Aquí puedes añadir métodos específicos de User si es necesario
}

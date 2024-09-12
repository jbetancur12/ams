import { Prisma,  User } from '@prisma/client';
import { BaseService } from './baseService';
import { db } from '../utils/db.server';
import bcrypt from 'bcryptjs';

export class UserService extends BaseService<User, Prisma.UserCreateInput, Prisma.UserUpdateInput> {
  constructor() {
    super(db, db.user);
  }



async create(data: Prisma.UserCreateInput): Promise<User> {
    // Hash the password if provided
    if (data.password) {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      data.password = hashedPassword;
    }  
    return super.create(data);
  }


  

  async getUsersByTenant(tenantId: number): Promise<User[]> {
    try {
      return await db.user.findMany({
        where: { tenantId },
      });
    } catch (error: any) {
      throw new Error(`Error obteniendo los usuarios por tenant: ${error.message}`);
    }
  }

  // Aquí puedes añadir métodos específicos de User si es necesario
}

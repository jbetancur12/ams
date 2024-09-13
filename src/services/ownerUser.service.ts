import { OwnerUser, Prisma } from '@prisma/client';
import { BaseService } from './baseService';
import { db } from '../utils/db.server';

export class OwnerUserService extends BaseService<OwnerUser, Prisma.OwnerUserCreateInput, Prisma.OwnerUserUpdateInput> {
  constructor() {
    super(db, db.ownerUser);
  }

  async getAllUsers(ownerId: number): Promise<OwnerUser[]> {
    try {
      return await db.ownerUser.findMany({
        where: { ownerId },
      });
    } catch (error: any) {
      throw new Error(`Error obteniendo los usuarios del propietario: ${error.message}`);
    }
  }

  // Aquí puedes añadir métodos específicos de OwnerUser si es necesario
}

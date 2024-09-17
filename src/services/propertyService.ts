// tenant.service.ts

import { Property, Prisma } from '@prisma/client';
import { BaseService } from './baseService';
import { db } from '../utils/db.server';

export class PropertyService extends BaseService<Property, Prisma.PropertyCreateInput, Prisma.PropertyUpdateInput> {
  constructor() {
    super(db, db.property);
  }

  async getAllProperties(ownerId: number): Promise<Property[]> {
    try {
      return await db.property.findMany({
        where: { ownerId: ownerId },
      });
    } catch (error: any) {
      throw new Error(`Error obteniendo los tenants: ${error.message}`);
    }
  }
  //   async getAllbyOwnerId(ownerId: number): Promise<Property[]> {
  //     try {
  //       return await db.tenant.findMany({
  //         where: { ownerId },
  //       });
  //     } catch (error: any) {
  //       throw new Error(`Error obteniendo los tenants: ${error.message}`);
  //     }
  //   }

  //   async getByEmail(email: string, ownerId: number): Promise<Property | null> {
  //     try {
  //       return await db.tenant.findUnique({
  //         where: {
  //           email_ownerId: {
  //             email,
  //             ownerId,
  //           },
  //         },
  //       });
  //     } catch (error: any) {
  //       throw new Error(`Error obteniendo el tenant: ${error.message}`);
  //     }
  //   }

  // Aquí puedes añadir métodos específicos de Property si es necesario
}

// tenant.service.ts

import { Unit, Prisma } from '@prisma/client';
import { BaseService } from './baseService';
import { db } from '../utils/db.server';

export class UnitService extends BaseService<Unit, Prisma.UnitCreateInput, Prisma.UnitUpdateInput> {
  constructor() {
    super(db, db.unit);
  }

  async getAllUnits(propertyId: number): Promise<Unit[]> {
    try {
      return await db.unit.findMany({
        where: { propertyId: propertyId },
      });
    } catch (error: any) {
      throw new Error(`Error obteniendo los tenants: ${error.message}`);
    }
  }
}

// Aquí puedes añadir métodos específicos de Unit si es necesario

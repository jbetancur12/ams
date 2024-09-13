// tenant.service.ts

import { Tenant, Prisma } from '@prisma/client';
import { BaseService } from './baseService';
import { db } from '../utils/db.server';

export class TenantService extends BaseService<Tenant, Prisma.TenantCreateInput, Prisma.TenantUpdateInput> {
  constructor() {
    super(db, db.tenant);
  }
  async getAllbyOwnerId(ownerId: number): Promise<Tenant[]> {
    try {
      return await db.tenant.findMany({
        where: { ownerId },
      });
    } catch (error: any) {
      throw new Error(`Error obteniendo los tenants: ${error.message}`);
    }
  }

  async getByEmail(email: string, ownerId: number): Promise<Tenant | null> {
    try {
      return await db.tenant.findUnique({
        where: {
          email_ownerId: {
            email,
            ownerId,
          },
        },
      });
    } catch (error: any) {
      throw new Error(`Error obteniendo el tenant: ${error.message}`);
    }
  }

  // Aquí puedes añadir métodos específicos de Tenant si es necesario
}

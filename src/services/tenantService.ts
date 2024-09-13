// tenant.service.ts

import { Tenant, Prisma } from '@prisma/client';
import { BaseService } from './baseService';
import { db } from '../utils/db.server';

export class TenantService extends BaseService<Tenant, Prisma.TenantCreateInput, Prisma.TenantUpdateInput> {
  constructor() {
    super(db, db.tenant);
  }

  // Aquí puedes añadir métodos específicos de Tenant si es necesario
}

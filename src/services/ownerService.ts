// owner.service.ts

import { Owner, Prisma } from '@prisma/client';
import { BaseService } from './baseService';
import { db } from '../utils/db.server';

export class OwnerService extends BaseService<Owner, Prisma.OwnerCreateInput, Prisma.OwnerUpdateInput> {
  constructor() {
    super(db, db.owner);
  }

  // Aquí puedes añadir métodos específicos de Owner si es necesario
}

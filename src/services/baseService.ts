// base.service.ts

import { Prisma, PrismaClient } from '@prisma/client';

export class BaseService<T, CInput, UInput> {
  protected prisma: PrismaClient;
  protected model: any;

  constructor(prisma: PrismaClient, model: any) {
    this.prisma = prisma;
    this.model = model;
  }

  async create(data: CInput): Promise<T> {
    return await this.model.create({ data });
  }

  async getAll(options?: Prisma.UserFindManyArgs): Promise<T[]> {
    try {
      return await this.model.findMany(options);
    } catch (error: any) {
      throw new Error(`Error obteniendo recursos: ${error.message}`);
    }
  }

  async getById(id: number): Promise<T | null> {
    try {
      return await this.model.findUnique({
        where: { id },
      });
    } catch (error: any) {
      throw new Error(`Error obteniendo el recurso por ID: ${error.message}`);
    }
  }

  async update(id: number, data: UInput): Promise<T | null> {
    try {
      return await this.model.update({
        where: { id },
        data,
      });
    } catch (error: any) {
      throw new Error(`Error actualizando el recurso: ${error.message}`);
    }
  }

  async delete(id: number): Promise<T | null> {
    try {
      return await this.model.delete({
        where: { id },
      });
    } catch (error: any) {
      throw new Error(`Error eliminando el recurso: ${error.message}`);
    }
  }
}

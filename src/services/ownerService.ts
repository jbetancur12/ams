import { Owner, Prisma } from '@prisma/client';
import { BaseService } from './baseService';
import { db } from '../utils/db.server';

export class OwnerService extends BaseService<Owner, Prisma.OwnerCreateInput, Prisma.OwnerUpdateInput> {
  constructor() {
    super(db, db.owner);
  }

  // Método para eliminar Owner y sus usuarios asociados
  async deleteOwnerAndRelatedUsers(ownerId: number): Promise<void> {
    try {
      await db.$transaction(async (prisma) => {
        // Primero, obtenemos los IDs de los usuarios relacionados con el owner
        const ownerUsers = await prisma.ownerUser.findMany({
          where: { ownerId: ownerId },
          select: { userId: true },
        });
        console.log('🚀 ~ OwnerService ~ awaitdb.$transaction ~ ownerUsers:', ownerUsers);

        const userIds = ownerUsers.map((ownerUser) => ownerUser.userId);

        // Eliminar las relaciones de OwnerUser
        await prisma.ownerUser.deleteMany({
          where: { ownerId: ownerId },
        });

        // Ahora eliminar los usuarios relacionados
        await prisma.user.deleteMany({
          where: { id: { in: userIds } },
        });

        // Finalmente, eliminar el Owner
        await prisma.owner.delete({
          where: { id: ownerId },
        });
      });
      console.log('Owner, usuarios asociados y relaciones eliminadas exitosamente.');
    } catch (error) {
      console.error('Error al eliminar Owner, usuarios asociados y relaciones:', error);
      throw error; // Puedes lanzar el error para manejarlo en el controlador si es necesario
    }
  }

  // Aquí puedes añadir métodos específicos de Owner si es necesario
}

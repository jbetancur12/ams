import { PrismaClient, Tenant } from '@prisma/client';

const prisma = new PrismaClient();

export class TenantService {
  async createTenant(name: string, email: string): Promise<Tenant> {
    try {
      const tenant = await prisma.tenant.create({
        data: {
          name,
          email,
        },
      });
      return tenant;
    } catch (error:any) {
      throw new Error(`Error creando el tenant: ${error.message}`);
    }
  }

  // Aquí puedes añadir otros métodos relacionados con Tenant
}

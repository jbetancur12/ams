import { NextFunction, Request, Response } from 'express';
import { TenantService } from '../services/tenantService';
import { RoleType } from '@prisma/client';
import { tenantSchema } from '../types/zod';


const tenantService = new TenantService();

export const createTenant = async (req: Request, res: Response) => {
  try {
    // Verificar si el usuario es superadmin
    const userRoles = req.user?.roles; // Suponiendo que se establece en el middleware de autorización
    
const isSuperAdmin = userRoles && Array.isArray(userRoles) && userRoles.some(role => role.name === RoleType.PLATFORM_ADMIN);


    if (!isSuperAdmin) {
      return res.status(403).json({ message: 'No tienes permiso para crear tenants' });
    }

    const { name, email } = req.body;
    const tenant = await tenantService.createTenant(name, email);
    return res.status(201).json(tenant);
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor', error });
  }
};


export const validateTenantData = (request: Request, response: Response, next: NextFunction) => {
  console.log(request.body);
    try {
      const tenant = request.body;
      tenantSchema.parse(tenant);
      next();
    } catch (error) {
      next(error);
    }
  };
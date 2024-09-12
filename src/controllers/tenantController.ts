import { NextFunction, Request, Response } from 'express';
import { TenantService } from '../services/tenantService';
import { RoleType } from '@prisma/client';
import { tenantSchema } from '../types/zod';



const tenantService = new TenantService();

export const getTenants = async (req: Request, res: Response) => {
  try {
    const tenants = await tenantService.getAll();
    return res.status(200).json(tenants);
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor', error });
  }
};

export const getTenantById = async (req: Request, res: Response) => {
  try {
    const tenantId = Number(req.params.id);
    const tenant = await tenantService.getById(tenantId);
    if (tenant) {
      return res.status(200).json(tenant);
    } else {
      return res.status(404).json({ message: 'Tenant no encontrado' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor', error });
  }
};

export const createTenant = async (req: Request, res: Response) => {
  try {
    // Verificar si el usuario es superadmin
    const userRole = req.user?.role; // Suponiendo que se establece en el middleware de autorización
    
const isSuperAdmin = userRole && userRole === RoleType.PLATFORM_ADMIN;


    if (!isSuperAdmin) {
      return res.status(403).json({ message: 'No tienes permiso para crear tenants' });
    }
    
    const tenant = await tenantService.create(req.body);
    return res.status(201).json(tenant);
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor', error });
  }
};

export const updateTenant = async (req: Request, res: Response) => {
  try {
    const tenantId = Number(req.params.id);
    const tenantData = req.body;
    const tenant = await tenantService.update( tenantId, tenantData);
    if (tenant) {
      return res.status(200).json(tenant);
    } else {
      return res.status(404).json({ message: 'Tenant no encontrado' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor', error });
  }
};

export const deleteTenant = async (req: Request, res: Response) => {
  try {
    const tenantId = Number(req.params.id);
    const tenant = await tenantService.delete(tenantId);
    if (tenant) {
      return res.status(200).json(tenant);
    } else {
      return res.status(404).json({ message: 'Tenant no encontrado' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor', error });
  }
};


export const validateTenantData = (request: Request, response: Response, next: NextFunction) => {
    try {
      const tenant = request.body;
      tenantSchema.parse(tenant);
      next();
    } catch (error) {
      next(error);
    }
  };
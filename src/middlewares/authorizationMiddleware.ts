import { RoleType } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';

export function authorizeRoles(roles?: RoleType[]) {
  
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
   
    const tenantId = (req as any).body.tenantId || (req as any).params.tenantId; // Asume que el tenantId puede venir en el body o en los params

    if (!user) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    // Si el usuario es Platform Admin, permite acceso sin restricciones
    if (user.role === RoleType.PLATFORM_ADMIN) {
      return next();
    }

    // Si el rol del usuario está en la lista de roles permitidos
    if (roles && roles.includes(user.role)) {
      // Si no es Platform Admin, verificar que el tenantId coincida
      if (user.tenantId === tenantId) {
        return next();
      } else {
        return res.status(403).json({ message: 'No tienes permiso para acceder a este tenant' });
      }
    }

    // Si el rol del usuario no está permitido
    return res.status(403).json({ message: 'No tienes permiso para acceder a esta acción' });
  };
}

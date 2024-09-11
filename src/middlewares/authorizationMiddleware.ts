import { RoleType } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';

export function authorizeRole(role: RoleType) { 

  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user || !user.roles.some((u: any) => u.name === role)) {
      return res.status(403).json({ message: 'No tienes permiso para acceder a esta acción' });
    }
    next();
  };
}


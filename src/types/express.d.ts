import { RoleType, User } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        role: RoleType;
        ownerId: number | null;
      };
    }
  }
}

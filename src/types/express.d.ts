import { RoleType, User } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      property?: any;
      user?: {
        id: number;
        email: string;
        role: RoleType;
        ownerId: number | null;
      };
    }
  }
}

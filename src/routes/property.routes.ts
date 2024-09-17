import { Router } from 'express';
import {
  createProperty,
  getAllProperties,
  getPropertyById,
  validatePropertyData,
} from '../controllers/propertyController';
import { authorizeRoles } from '../middlewares/authorizationMiddleware';
import { authenticateToken } from '../middlewares/authMiddleware';
import { RoleType } from '@prisma/client';

const router = Router();

// Solo superadmin puede crear un tenant
router.get('/:ownerId', authenticateToken, authorizeRoles([RoleType.OWNER, RoleType.OWNER_ADMIN]), getAllProperties);
router.get(
  '/:ownerId/:propertyId',
  authenticateToken,
  authorizeRoles([RoleType.OWNER, RoleType.OWNER_ADMIN]),
  getPropertyById
);

// Añadir rutas para crear, actualizar, eliminar propiedades
router.post(
  '/:ownerId',
  authenticateToken,
  authorizeRoles([RoleType.OWNER, RoleType.OWNER_ADMIN]),
  validatePropertyData,
  createProperty
);

export default router;

import { Router } from 'express';
import {
  createProperty,
  deleteProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  validatePropertyData,
} from '../controllers/propertyController';
import { authorizeRoles } from '../middlewares/authorizationMiddleware';
import { authenticateToken } from '../middlewares/authMiddleware';
import { RoleType } from '@prisma/client';
import { validatePropertyOwnership } from '../middlewares/validatePropertyOwnership';

const router = Router();

// Solo superadmin puede crear un tenant
router.get('/:ownerId', authenticateToken, authorizeRoles([RoleType.OWNER, RoleType.OWNER_ADMIN]), getAllProperties);
router.get(
  '/:ownerId/:propertyId',
  authenticateToken,
  authorizeRoles([RoleType.OWNER, RoleType.OWNER_ADMIN]),
  validatePropertyOwnership,
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
router.put(
  '/:ownerId/:propertyId',
  authenticateToken,
  authorizeRoles([RoleType.OWNER, RoleType.OWNER_ADMIN]),
  validatePropertyOwnership,
  validatePropertyData,
  updateProperty
);
router.delete(
  '/:ownerId/:propertyId',
  authenticateToken,
  authorizeRoles([RoleType.OWNER, RoleType.OWNER_ADMIN]),
  validatePropertyOwnership,
  deleteProperty
);

export default router;

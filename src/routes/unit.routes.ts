import { Router } from 'express';
import {
  createUnit,
  deleteUnit,
  getAllUnits,
  getUnitById,
  updateUnit,
  validateUnitData,
} from '../controllers/unitController';
import { authorizeRoles } from '../middlewares/authorizationMiddleware';
import { authenticateToken } from '../middlewares/authMiddleware';
import { RoleType } from '@prisma/client';
import { validatePropertyOwnership } from '../middlewares/validatePropertyOwnership';

const router = Router();

// Solo superadmin puede crear un tenant
router.get(
  '/:ownerId/:propertyId',
  authenticateToken,
  authorizeRoles([RoleType.OWNER, RoleType.OWNER_ADMIN]),
  validatePropertyOwnership,
  getAllUnits
);
router.get(
  '/:ownerId/:propertyId/:unitId',
  authenticateToken,
  authorizeRoles([RoleType.OWNER, RoleType.OWNER_ADMIN]),
  validatePropertyOwnership,
  getUnitById
);
router.put(
  '/:ownerId/:propertyId/:unitId',
  authenticateToken,
  authorizeRoles([RoleType.OWNER, RoleType.OWNER_ADMIN]),
  validatePropertyOwnership,
  validateUnitData,
  updateUnit
);
router.post(
  '/:ownerId/:propertyId',
  authenticateToken,
  authorizeRoles([RoleType.OWNER, RoleType.OWNER_ADMIN]),
  validatePropertyOwnership,
  validateUnitData,
  createUnit
);
router.delete(
  '/:ownerId/:propertyId/:unitId',
  authenticateToken,
  authorizeRoles([RoleType.OWNER, RoleType.OWNER_ADMIN]),
  validatePropertyOwnership,
  deleteUnit
);
export default router;

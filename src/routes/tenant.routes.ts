import { Router } from 'express';
import {
  createTenant,
  deleteTenant,
  getTenantById,
  getTenants,
  updateTenant,
  validateTenantData,
} from '../controllers/tenantController';
import { authorizeRoles } from '../middlewares/authorizationMiddleware';
import { authenticateToken } from '../middlewares/authMiddleware';
import { RoleType } from '@prisma/client';

const router = Router();

// Solo superadmin puede crear un tenant
router.get('/:ownerId', authenticateToken, authorizeRoles([RoleType.OWNER, RoleType.OWNER_ADMIN]), getTenants);
router.get(
  '/:ownerId/:tenantId',
  authenticateToken,
  authorizeRoles([RoleType.OWNER, RoleType.OWNER_ADMIN]),
  getTenantById
);
router.post(
  '/:ownerId',
  authenticateToken,
  authorizeRoles([RoleType.OWNER, RoleType.OWNER_ADMIN]),
  validateTenantData,
  createTenant
);
router.put(
  '/:ownerId/:id',
  authenticateToken,
  authorizeRoles([RoleType.OWNER, RoleType.OWNER_ADMIN]),
  validateTenantData,
  updateTenant
);
router.delete('/:ownerId/:id', authenticateToken, authorizeRoles([RoleType.OWNER, RoleType.OWNER_ADMIN]), deleteTenant);

export default router;

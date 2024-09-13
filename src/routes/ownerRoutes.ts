import { Router } from 'express';
import {
  createOwner,
  createOwnUser,
  deleteOwner,
  getOwnerById,
  getOwners,
  updateOwner,
  validateOwnerData,
  validateOwnerUserData,
} from '../controllers/ownerController';
import { authorizeRoles } from '../middlewares/authorizationMiddleware';
import { authenticateToken } from '../middlewares/authMiddleware';
import { RoleType } from '@prisma/client';

const router = Router();

// Solo superadmin puede crear un tenant
router.get('/', authenticateToken, authorizeRoles(), getOwners);
router.get('/:ownerId', authenticateToken, authorizeRoles(), getOwnerById);
router.post('/', authenticateToken, authorizeRoles(), validateOwnerData, createOwner);
router.post(
  '/:ownerId/users',
  authenticateToken,
  authorizeRoles([RoleType.OWNER]),
  validateOwnerUserData,
  createOwnUser
);
router.put('/:ownerId', authenticateToken, authorizeRoles(), validateOwnerData, updateOwner);
router.delete('/:ownerId', authenticateToken, authorizeRoles(), deleteOwner);

export default router;

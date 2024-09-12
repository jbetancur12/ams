import { Router } from 'express';
import {
  createOwner,
  deleteOwner,
  getOwnerById,
  getOwners,
  updateOwner,
  validateOwnerData,
} from '../controllers/ownerController';
import { authorizeRoles } from '../middlewares/authorizationMiddleware';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

// Solo superadmin puede crear un tenant
router.get('/', authenticateToken, authorizeRoles(), getOwners);
router.get('/:id', authenticateToken, authorizeRoles(), getOwnerById);
router.post('/', authenticateToken, authorizeRoles(), validateOwnerData, createOwner);
router.put('/:id', authenticateToken, authorizeRoles(), validateOwnerData, updateOwner);
router.delete('/:id', authenticateToken, authorizeRoles(), deleteOwner);

export default router;

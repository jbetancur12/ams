import { Router } from 'express';
import { createOwnUser, validateOwnUserData } from '../controllers/ownerUserController';
import { authorizeRoles } from '../middlewares/authorizationMiddleware';
import { authenticateToken } from '../middlewares/authMiddleware';
import { RoleType } from '@prisma/client';

const router = Router();

// Crear un usuario para un propietario
router.post('/:ownerId', authenticateToken, authorizeRoles([RoleType.OWNER]), validateOwnUserData, createOwnUser);

export default router;

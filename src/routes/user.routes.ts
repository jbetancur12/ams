import { Router } from 'express';
import { getAllUsers, getUserById } from '../controllers/userController';
import { authorizeRoles } from '../middlewares/authorizationMiddleware';
import { authenticateToken } from '../middlewares/authMiddleware';
import { RoleType } from '@prisma/client';

const router = Router();

router.get('/', authenticateToken, authorizeRoles([RoleType.OWNER]), getAllUsers);
router.get('/:id', authenticateToken, authorizeRoles([RoleType.OWNER]), getUserById);

// Añadir rutas para crear, actualizar, eliminar usuarios

export default router;

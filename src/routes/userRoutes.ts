import { Router } from 'express';
import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from '../controllers/userController';
import { authorizeRoles } from '../middlewares/authorizationMiddleware';
import { authenticateToken } from '../middlewares/authMiddleware';
import { RoleType } from '@prisma/client';
import { validateTenantData } from '../controllers/tenantController';

const router = Router();

router.post('/', authenticateToken, authorizeRoles([RoleType.OWNER]), validateTenantData, createUser);
router.get('/', authenticateToken, authorizeRoles([RoleType.OWNER]), getAllUsers);
router.get('/:id', authenticateToken, authorizeRoles([RoleType.OWNER]), validateTenantData, getUserById);
router.put('/:id', authenticateToken, authorizeRoles([RoleType.OWNER]), validateTenantData, updateUser);
router.delete('/:id', authenticateToken, authorizeRoles([RoleType.OWNER]), validateTenantData, deleteUser);

// Añadir rutas para crear, actualizar, eliminar usuarios

export default router;

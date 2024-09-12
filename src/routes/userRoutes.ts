import { Router } from 'express';
import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from '../controllers/userController';
import { authorizeRoles } from '../middlewares/authorizationMiddleware';
import { authenticateToken } from '../middlewares/authMiddleware';
import { RoleType } from '@prisma/client';
import { validateTenantData } from '../controllers/tenantController';


const router = Router();

router.post('/', authenticateToken, authorizeRoles([RoleType.SUPER_ADMIN]), validateTenantData, createUser);
router.get('/', authenticateToken, authorizeRoles([RoleType.SUPER_ADMIN]), getAllUsers);
router.get('/:id', authenticateToken, authorizeRoles([RoleType.SUPER_ADMIN]), validateTenantData,getUserById);
router.put('/:id',authenticateToken, authorizeRoles([RoleType.SUPER_ADMIN]), validateTenantData, updateUser);
router.delete('/:id', authenticateToken, authorizeRoles([RoleType.SUPER_ADMIN]), validateTenantData, deleteUser);


// Añadir rutas para crear, actualizar, eliminar usuarios

export default router;
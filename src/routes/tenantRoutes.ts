import { Router } from 'express';
import { createTenant, deleteTenant, getTenantById, getTenants, updateTenant, validateTenantData } from '../controllers/tenantController';
import { authorizeRole } from '../middlewares/authorizationMiddleware';
import { RoleType } from '@prisma/client';
import { authenticateToken } from '../middlewares/authMiddleware';


const router = Router();

// Solo superadmin puede crear un tenant
router.get('/', authenticateToken, getTenants);
router.get('/:id', authenticateToken, getTenantById);
router.post('/', authenticateToken, authorizeRole(RoleType.PLATFORM_ADMIN), validateTenantData, createTenant);
router.put('/:id', authenticateToken, authorizeRole(RoleType.PLATFORM_ADMIN), validateTenantData, updateTenant);
router.delete('/:id', authenticateToken, authorizeRole(RoleType.PLATFORM_ADMIN), deleteTenant);

export default router;
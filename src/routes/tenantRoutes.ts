import { Router } from 'express';
import { createTenant, validateTenantData } from '../controllers/tenantController';
import { authorizeRole } from '../middlewares/authorizationMiddleware';
import { RoleType } from '@prisma/client';
import { authenticateToken } from '../middlewares/authMiddleware';


const router = Router();

// Solo superadmin puede crear un tenant
router.post('/', authenticateToken, authorizeRole(RoleType.PLATFORM_ADMIN), validateTenantData, createTenant);

export default router;
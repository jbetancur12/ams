import { Router } from 'express';
import { createTenant, deleteTenant, getTenantById, getTenants, updateTenant, validateTenantData } from '../controllers/tenantController';
import { authorizeRoles } from '../middlewares/authorizationMiddleware';
import { authenticateToken } from '../middlewares/authMiddleware';


const router = Router();

// Solo superadmin puede crear un tenant
router.get('/', authenticateToken, authorizeRoles(), getTenants);
router.get('/:id', authenticateToken, authorizeRoles(), getTenantById);
router.post('/', authenticateToken, authorizeRoles(), validateTenantData, createTenant);
router.put('/:id', authenticateToken, authorizeRoles(), validateTenantData, updateTenant);
router.delete('/:id', authenticateToken, authorizeRoles(), deleteTenant);

export default router;
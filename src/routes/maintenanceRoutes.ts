import { Router } from 'express';
import { getMaintenanceRequests } from '../controllers/maintenanceController';

const router = Router();

router.get('/',  getMaintenanceRequests);

// Añadir rutas para crear, actualizar, eliminar solicitudes de mantenimiento

export default router;

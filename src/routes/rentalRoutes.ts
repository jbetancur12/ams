import { Router } from 'express';
import { getRentals } from '../controllers/rentalController';

const router = Router();

router.get('/', getRentals);

// Añadir rutas para crear, actualizar, eliminar arrendamientos

export default router;

import { getApartments } from '../controllers/apartmentController';
import { Router } from 'express';


const router = Router();

router.get('/', getApartments);

// Añadir rutas para crear, actualizar, eliminar apartamentos

export default router;

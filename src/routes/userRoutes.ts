 import { Router } from 'express';
import { getUsers } from '../controllers/userController';

const router = Router();

router.get('/',   getUsers);


// Añadir rutas para crear, actualizar, eliminar usuarios

export default router;
import express from 'express';
import { login, loginAdmin, registerPlatformAdmin, validateUserData } from '../controllers/authController';

const router = express.Router();

router.post('/register-platform-admin', validateUserData, registerPlatformAdmin);
router.post('/login-admin', loginAdmin);
router.post('/login', login);

export default router;

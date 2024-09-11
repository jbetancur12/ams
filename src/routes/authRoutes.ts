import express from 'express';
import { loginAdmin, registerPlatformAdmin, validateUserData } from '../controllers/authController';

const router = express.Router();


router.post('/register-platform-admin', validateUserData, registerPlatformAdmin);
router.post('/login-admin', loginAdmin);

export default router;

import { Router } from 'express';
import { createRental, getRentals, validateRentalData } from '../controllers/rental.controller';
import { authenticateToken } from 'middlewares/authMiddleware';
import { authorizeRoles } from 'middlewares/authorizationMiddleware';
import { RoleType } from '@prisma/client';

const router = Router();

router.get('/:ownerId/', authenticateToken, authorizeRoles([RoleType.OWNER, RoleType.OWNER_ADMIN]), getRentals);
router.post(
  '/:ownerId/',
  authenticateToken,
  authorizeRoles([RoleType.OWNER, RoleType.OWNER_ADMIN]),
  validateRentalData,
  createRental
);

export default router;

import { NextFunction, Request, Response } from 'express';
import { OwnerUserService } from '../services/ownerUser.service';
import { RoleType } from '@prisma/client';
import { ownerUserSchema } from '../types/zod';
import { UserService } from '../services/userService';
import { db } from '../utils/db.server';

const ownerUserService = new OwnerUserService();
const userService = new UserService();
const ownerService = new OwnerUserService();

export const createOwnUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { body } = req;
    const ownerId = Number(req.params.ownerId);
    const userExists = await userService.getByEmail(body.email, ownerId);
    if (userExists) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const data = { ...body, password: 'ChangeMe' };

    // Verificar si el usuario es superadmin
    const userRole = req.user?.role; // Suponiendo que se establece en el middleware de autorización
    const id = req.user?.ownerId;

    const isOwner = userRole && userRole === RoleType.OWNER;
    const isSameOwner = userRole && id === ownerId;

    if (!(isOwner && isSameOwner) && req.user?.role !== RoleType.PLATFORM_ADMIN) {
      return res.status(403).json({ message: 'No tienes permiso para crear usuarios' });
    }

    const result = await db.$transaction(async () => {
      const user = await userService.create({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        ownerId,
      });

      await ownerUserService.create({
        owner: { connect: { id: ownerId } },
        user: { connect: { id: user.id } },
      });

      return user;
    });

    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateOwnUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ownerId = Number(req.params.ownerId);
    const ownerExists = await ownerService.getById(ownerId);
    if (!ownerExists) {
      return res.status(404).json({ message: 'Owner no encontrado' });
    }
    const userId = Number(req.params.userId);
    const userData = req.body;
    const user = await ownerUserService.update(userId, userData);
    if (user) {
      return res.status(200).json(user);
    } else {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    next(error);
  }
};

export const validateOwnUserData = (request: Request, response: Response, next: NextFunction) => {
  try {
    const user = request.body;
    ownerUserSchema.parse(user);
    next();
  } catch (error) {
    next(error);
  }
};

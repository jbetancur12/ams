import { NextFunction, Request, Response } from 'express';
import { OwnerService } from '../services/ownerService';
import { RoleType } from '@prisma/client';
import { ownerSchema, ownerUserSchema } from '../types/zod';
import { UserService } from '../services/userService';
import { db } from '../utils/db.server';

const ownerService = new OwnerService();
const userService = new UserService();

export const getOwners = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const owners = await ownerService.getAll();
    return res.status(200).json(owners);
  } catch (error) {
    next(error);
  }
};

export const getOwnerById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ownerId = Number(req.params.ownerId);
    const owner = await ownerService.getById(ownerId);
    if (owner) {
      return res.status(200).json(owner);
    } else {
      return res.status(404).json({ message: 'Owner no encontrado' });
    }
  } catch (error) {
    next(error);
  }
};

export const createOwner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { body } = req;
    const data = { ...body, role: RoleType.OWNER, password: 'ChangeMe' };
    // Verificar si el usuario es superadmin
    const userRole = req.user?.role; // Suponiendo que se establece en el middleware de autorización

    const allowed = userRole && userRole === RoleType.PLATFORM_ADMIN;

    if (!allowed) {
      return res.status(403).json({ message: 'No tienes permiso para crear owners' });
    }

    const result = await db.$transaction(async (prisma) => {
      // Primero, crea el Usuario
      const user = await userService.create({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      });

      const owner = await ownerService.create({
        user: { connect: { id: user.id } },
      });

      await userService.update(user.id, { owner: { connect: { id: owner.id } } });
      return owner;
    });
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateOwner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ownerId = Number(req.params.ownerId);
    const ownerData = req.body;
    const owner = await ownerService.update(ownerId, ownerData);
    if (owner) {
      return res.status(200).json(owner);
    } else {
      return res.status(404).json({ message: 'Owner no encontrado' });
    }
  } catch (error) {
    next(error);
  }
};

export const deleteOwner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ownerId = Number(req.params.ownerId);
    const owner = await ownerService.delete(ownerId);
    if (owner) {
      return res.status(200).json(owner);
    } else {
      return res.status(404).json({ message: 'Owner no encontrado' });
    }
  } catch (error) {
    next(error);
  }
};

export const createOwnUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { body } = req;
    const ownerId = Number(req.params.ownerId);

    const data = { ...body, password: 'ChangeMe' };

    // Verificar si el usuario es superadmin
    const userRole = req.user?.role; // Suponiendo que se establece en el middleware de autorización
    const id = req.user?.ownerId;

    const isOwner = userRole && userRole === RoleType.OWNER;
    const isSameOwner = userRole && id === ownerId;

    if (!isOwner || !isSameOwner) {
      return res.status(403).json({ message: 'No tienes permiso para crear usuarios' });
    }

    // Primero, crea el Usuario
    const user = await userService.createUser({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
      owner: { connect: { id: ownerId } },
    });

    return res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const validateOwnerData = (request: Request, response: Response, next: NextFunction) => {
  try {
    const owner = request.body;
    ownerSchema.parse(owner);
    next();
  } catch (error) {
    next(error);
  }
};

export const validateOwnerUserData = (request: Request, response: Response, next: NextFunction) => {
  try {
    const user = request.body;
    ownerUserSchema.parse(user);
    next();
  } catch (error) {
    next(error);
  }
};

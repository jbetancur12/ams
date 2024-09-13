// user.controller.ts

import { Request, Response } from 'express';
import { UserService } from '../services/userService';

const userService = new UserService();

export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await userService.getAll();
    res.status(200).json(users);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await userService.getById(parseInt(req.params.id));
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

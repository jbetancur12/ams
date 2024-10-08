import { NextFunction, Request, Response } from 'express';

import * as AuthService from '../services/auth.service';
import { userSchema } from '../types/zod';

export const registerPlatformAdmin = async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body);
  const { name, email, password } = req.body;
  try {
    const admin = await AuthService.registerPlatformAdmin(email, password, name);
    res.status(201).json({ message: 'Administrador registrado con éxito', admin });
  } catch (error) {
    next(error);
  }
};

// Inicio de sesión de administradores
export const loginAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const token = await AuthService.loginAdmin(email, password);
    if (!token) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    res.status(200).json({ message: 'Inicio de sesión exitoso', token });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, domain } = req.body;

  try {
    const token = await AuthService.login(email, password, domain);
    if (!token) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    res.status(200).json({ message: 'Inicio de sesión exitoso', token });
  } catch (error) {
    next(error);
  }
};

export const validateUserData = (request: Request, response: Response, next: NextFunction) => {
  try {
    const user = request.body;
    userSchema.parse(user);
    next();
  } catch (error) {
    next(error);
  }
};

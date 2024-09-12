import { NextFunction, Request, Response } from 'express';

import { AuthService } from '../services/authService';
import { userSchema } from '../types/zod';

const authService = new AuthService();

export const registerPlatformAdmin = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    const admin = await authService.registerPlatformAdmin(email, password, name);
    res.status(201).json({ message: 'Administrador registrado con éxito', admin });
  } catch (error) {
    res.status(400).json({ message: 'Error al registrar el administrador', error });
  }
};

// Inicio de sesión de administradores
export const loginAdmin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const token = await authService.loginAdmin(email, password);
    if (!token) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    res.status(200).json({ message: 'Inicio de sesión exitoso', token });
  } catch (error) {
    res.status(400).json({ message: 'Error en el inicio de sesión', error });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const token = await authService.login(email, password);
    if (!token) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    res.status(200).json({ message: 'Inicio de sesión exitoso', token });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: 'Error en el inicio de sesión', error: error.message });
    } else {
      // Si el error no es una instancia de Error, envía un mensaje genérico
      res.status(400).json({ message: 'Error en el inicio de sesión', error: 'Error desconocido' });
    }
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

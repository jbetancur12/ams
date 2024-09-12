import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface JwtPayload {
  userId: number;
  role: string
  email: string;
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  console.log(token)
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload;

    // Obtener el usuario y sus roles desde la base de datos
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
     
    });

    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    } 


    // Adjuntar el usuario a la solicitud (puedes simplificar esta información)
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getApartments = async (req: Request, res: Response) => {
  try {
    const apartments = await prisma.apartment.findMany();
    return res.status(200).json(apartments);
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor', error });
  }
};

// Añadir otros métodos CRUD como create, update, delete

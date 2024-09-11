import { Request, Response } from 'express';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getRentals = async (req: Request, res: Response) => {
  try {
    const rentals = await prisma.rental.findMany();
    return res.status(200).json(rentals);
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor', error });
  }
};

// Añadir otros métodos CRUD como create, update, delete

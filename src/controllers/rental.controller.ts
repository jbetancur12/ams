import { NextFunction, Request, Response } from 'express';

import { PrismaClient } from '@prisma/client';
import { rentalSchema } from 'types/zod';

const prisma = new PrismaClient();

export const getRentals = async (req: Request, res: Response) => {
  const { ownerId } = req.params;
  try {
    const rentals = await prisma.rental.findMany({
      where: {
        unit: {
          property: {
            owner: {
              id: Number(ownerId),
            },
          },
        },
      },
      include: {
        unit: true,
        tenant: true,
      },
    });
    return res.status(200).json(rentals);
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor', error });
  }
};

export const createRental = async (req: Request, res: Response) => {
  const { startDate, endDate, rentAmount, unitId, tenantId } = req.body;

  const unit = await prisma.unit.findUnique({
    where: { id: unitId },
    // Incluir el inquilino actual de la unidad
  });

  if (unit?.status !== 'AVAILABLE') {
    return res.status(400).json({ message: 'Unidad no disponible' });
  }

  try {
    const [rental] = await prisma.$transaction([
      // Crear el alquiler
      prisma.rental.create({
        data: {
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          rentAmount: parseFloat(rentAmount),
          unit: {
            connect: {
              id: unitId,
            },
          },
          tenant: {
            connect: {
              id: tenantId,
            },
          },
        },
      }),
      // Actualizar la unidad con el tenantId
      prisma.unit.update({
        where: { id: unitId },
        data: { tenantId: tenantId, status: 'RENTED' },
      }),
    ]);

    return res.status(201).json(rental);
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor', error });
  }
};

export const validateRentalData = (request: Request, response: Response, next: NextFunction) => {
  try {
    const rental = request.body;
    rentalSchema.parse(rental);
    next();
  } catch (error) {
    next(error);
  }
};

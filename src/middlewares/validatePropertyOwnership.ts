import { Request, Response, NextFunction } from 'express';
import { PropertyService } from '../services/propertyService';
// Asegúrate de ajustar la ruta según tu estructura de archivos

const propertyService = new PropertyService();

export const validatePropertyOwnership = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const propertyId = Number(req.params.propertyId);
    const ownerId = Number(req.params.ownerId);

    if (isNaN(propertyId) || isNaN(ownerId)) {
      return res.status(400).json({ message: 'ID de propiedad o propietario inválido' });
    }

    const propertyExists = await propertyService.getById(propertyId);
    if (!propertyExists) {
      return res.status(404).json({ message: 'Propiedad no encontrada' });
    }

    if (propertyExists.ownerId !== ownerId) {
      return res.status(403).json({ message: 'No tienes permiso para realizar esta acción en la propiedad' });
    }

    // Si todo está bien, adjunta la propiedad en la request para acceder fácilmente en el siguiente controlador
    req.property = propertyExists;

    next(); // Pasa al siguiente middleware/controlador
  } catch (error) {
    next(error);
  }
};

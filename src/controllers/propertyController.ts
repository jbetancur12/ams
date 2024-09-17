// property.controller.ts

import { NextFunction, Request, Response } from 'express';
import { PropertyService } from '../services/propertyService';
import { propertySchema } from '../types/zod';

const propertyService = new PropertyService();

export const getAllProperties = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const properties = await propertyService.getAll();
    return res.status(200).json(properties);
  } catch (error) {
    next(error);
  }
};

export const getPropertyById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const propertyId = Number(req.params.propertyId);
    const property = await propertyService.getById(propertyId);
    if (property) {
      return res.status(200).json(property);
    } else {
      return res.status(404).json({ message: 'Property no encontrado' });
    }
  } catch (error) {
    next(error);
  }
};

export const createProperty = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { body } = req;
    const ownerId = Number(req.params.ownerId);
    const property = await propertyService.create({ ...body, ownerId });
    return res.status(201).json(property);
  } catch (error) {
    next(error);
  }
};

export const updateProperty = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const propertyId = Number(req.params.id);
    const propertyData = req.body;
    const property = await propertyService.update(propertyId, propertyData);
    if (property) {
      return res.status(200).json(property);
    } else {
      return res.status(404).json({ message: 'Property no encontrado' });
    }
  } catch (error) {
    next(error);
  }
};

export const deleteProperty = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const propertyId = Number(req.params.id);
    const property = await propertyService.delete(propertyId);
    if (property) {
      return res.status(200).json(property);
    } else {
      return res.status(404).json({ message: 'Property no encontrado' });
    }
  } catch (error) {
    next(error);
  }
};

export const validatePropertyData = (request: Request, response: Response, next: NextFunction) => {
  try {
    const property = request.body;
    propertySchema.parse(property);
    next();
  } catch (error) {
    next(error);
  }
};

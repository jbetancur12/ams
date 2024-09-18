import { NextFunction, Request, Response } from 'express';
import { UnitService } from '../services/unitService';
import { unitSchema } from '../types/zod';

const unitService = new UnitService();

export const getAllUnits = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const propertyId = Number(req.params.propertyId);
    const units = await unitService.getAll({
      where: { propertyId: propertyId },
    });
    return res.status(200).json(units);
  } catch (error) {
    next(error);
  }
};

export const getUnitById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const unitId = Number(req.params.unitId);
    const unit = await unitService.getById(unitId);
    if (unit) {
      return res.status(200).json(unit);
    } else {
      return res.status(404).json({ message: 'Unit no encontrado' });
    }
  } catch (error) {
    next(error);
  }
};

export const createUnit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { body } = req;
    const property = Number(req.params.propertyId);
    const unit = await unitService.create({ ...body, property: { connect: { id: property } } });
    return res.status(201).json(unit);
  } catch (error) {
    next(error);
  }
};

export const updateUnit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const unitId = Number(req.params.unitId);
    const unitData = req.body;
    const unit = await unitService.update(unitId, unitData);
    if (unit) {
      return res.status(200).json(unit);
    } else {
      return res.status(404).json({ message: 'Unit no encontrado' });
    }
  } catch (error) {
    next(error);
  }
};

export const deleteUnit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const unitId = Number(req.params.unitId);
    const unit = await unitService.delete(unitId);
    if (unit) {
      return res.status(200).json(unit);
    } else {
      return res.status(404).json({ message: 'Unit no encontrado' });
    }
  } catch (error) {
    next(error);
  }
};

export const validateUnitData = (request: Request, response: Response, next: NextFunction) => {
  try {
    const unit = request.body;
    unitSchema.parse(unit);
    next();
  } catch (error) {
    next(error);
  }
};

import { PropertyType, RoleType, UnitType } from '@prisma/client';
import { z } from 'zod';

export const tenantSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
});

export const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  // role: z.enum([RoleType.PLATFORM_ADMIN, RoleType.OWNER, RoleType.OWNER_ADMIN, RoleType.TENANT]),
});

export const ownerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  domain: z.string().min(1, 'Domain is required'),
});

export const ownerUserSchema = ownerSchema.extend({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  role: z.enum([RoleType.OWNER, RoleType.OWNER_ADMIN]),
});

export const propertySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum([PropertyType.HOUSE, PropertyType.BUILDING, PropertyType.COMMERCIAL, PropertyType.MIXED]),
});

export const unitSchema = z.object({
  type: z.enum([UnitType.APARTMENT, UnitType.LOCAL, UnitType.GARAGE, UnitType.ROOM]),
});

export const rentalSchema = z.object({
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  rentAmount: z.number().min(1, 'Rent amount is required'),
  unitId: z.number().min(1, 'Unit id is required'),
  tenantId: z.number().min(1, 'Tenant id is required'),
});

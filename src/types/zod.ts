import { RoleType } from "@prisma/client";
import { z } from "zod";

export const tenantSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
  });

export const userSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    role: z.enum([RoleType.PLATFORM_ADMIN, RoleType.SUPER_ADMIN, RoleType.ADMIN, RoleType.TENANT]) 
  });
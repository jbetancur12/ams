import { RoleType } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { config } from '../config/config';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';

// Función para registrar al administrador de la plataforma
export const registerPlatformAdmin = async (email: string, password: string, name: string) => {
  // Verificar si ya existe un usuario con ese email

  const existingUser = await prisma.user.findFirst({ where: { email } });

  if (existingUser) {
    throw new Error('El usuario ya está registrado');
  }

  // Hashear la contraseña
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Crear el administrador de la plataforma
  const admin = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: RoleType.PLATFORM_ADMIN,
    },
  });

  return admin;
};

// Función para iniciar sesión como administrador de la plataforma
export const loginAdmin = async (email: string, password: string) => {
  const platformAdmin = await prisma.platformAdmin.findFirst({
    where: {
      user: {
        email: email,
      },
    },
    include: {
      user: true, // Incluye el usuario para verificar la contraseña y el rol
    },
  });
  console.log('🚀 ~ loginAdmin ~ platformAdmin:', platformAdmin);

  if (!platformAdmin || platformAdmin.user.role !== RoleType.PLATFORM_ADMIN) {
    throw new Error('Usuario no autorizado o no encontrado');
  }

  // Verificar si la contraseña es válida
  const isPasswordValid = await bcrypt.compare(password, platformAdmin.user.password);
  if (!isPasswordValid) {
    throw new Error('Credenciales inválidas');
  }

  // Generar el token JWT
  const token = jwt.sign(
    { userId: platformAdmin.user.id, email: platformAdmin.user.email, roles: platformAdmin.user.role },
    config.JWT_SECRET,
    {
      expiresIn: '1h',
    }
  );

  return token;
};

// Función para iniciar sesión como usuario regular asociado a un propietario (owner)
export const login = async (email: string, password: string, domain: string) => {
  // Buscar al propietario por dominio
  const owner = await prisma.owner.findUnique({
    where: { domain },
  });

  if (!owner) {
    throw new Error('Dominio no encontrado');
  }

  // Buscar al usuario por correo electrónico y ownerId
  const user = await prisma.user.findUnique({
    where: {
      email_ownerId: {
        email,
        ownerId: owner.id,
      },
    },
  });

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  // Verificar la contraseña
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Credenciales inválidas');
  }

  // Verificar la asociación con OwnerUser
  const ownerUser = await prisma.ownerUser.findUnique({
    where: {
      ownerId_userId: {
        ownerId: owner.id,
        userId: user.id,
      },
    },
  });

  if (!ownerUser) {
    throw new Error('Usuario no asociado al propietario o rol inválido');
  }

  // Generar el token JWT
  const token = jwt.sign({ userId: user.id, email: user.email }, config.JWT_SECRET, { expiresIn: '1h' });

  return token;
};

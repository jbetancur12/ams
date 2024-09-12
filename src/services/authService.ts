import { PrismaClient, RoleType, User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { config } from '../config/config';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();


export class AuthService {
  async registerPlatformAdmin(email: string, password: string, name: string): Promise<User> {
    // Verificar si ya existe un usuario con ese email
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error('El usuario ya está registrado');
    }

       // Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        isPlatformAdmin: true, // Solo registra usuarios con el rol de administrador de la plataforma
        role: RoleType.PLATFORM_ADMIN
      },
    });
    return admin;
  }

  async loginAdmin(email: string, password: string): Promise<string | null> {
   
    const admin = await prisma.user.findUnique({
      where: { email }
    });

   
    
    if (!admin || !admin.isPlatformAdmin) {
      throw new Error('Usuario no autorizado o no encontrado');
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new Error('Credenciales inválidas');
    }

    const token = jwt.sign({ userId: admin.id, email: admin.email, roles: admin.role }, config.JWT_SECRET, {
      expiresIn: '1h',
    });

    return token;
  }

  async login(email: string, password: string): Promise<string | null> {
   
    const user = await prisma.user.findUnique({
      where: { email }
    });

   
    
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Credenciales inválidas');
    }

    const token = jwt.sign({ userId: user.id, email: user.email, roles: user.role }, config.JWT_SECRET, {
      expiresIn: '1h',
    });

    return token;
  }
}

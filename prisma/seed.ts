import { PrismaClient, RoleType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Verificar si ya existe el usuario con el email proporcionado

  // Crear contraseña hashada
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('password123', salt); // Cambia la contraseña si es necesario

  // Crear el usuario Platform Admin
  const user = await prisma.user.create({
    data: {
      email: 'jabetancur12@gmail.com', // Cambia el email si es necesario
      password: hashedPassword,
      name: 'Platform Admin',
      role: RoleType.PLATFORM_ADMIN, // Asigna el rol directamente
    },
  });

  // Crear el Platform Admin asociado al usuario
  const admin = await prisma.platformAdmin.create({
    data: {
      user: { connect: { id: user.id } },
    },
  });

  console.log('Platform Admin creado:', admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

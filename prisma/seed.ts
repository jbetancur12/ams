import { PrismaClient, RoleType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Verificar si los roles ya están creados
  const existingRoles = await prisma.role.findMany();
  if (existingRoles.length === 0) {
    await prisma.role.createMany({
      data: [
        { name: RoleType.PLATFORM_ADMIN },
        { name: RoleType.SUPER_ADMIN },
        { name: RoleType.ADMIN },
        { name: RoleType.TENANT },
      ],
    });
    console.log('Roles insertados exitosamente');
  } else {
    console.log('Los roles ya existen');
  }

  // Verificar si ya existe el Platform Admin
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'jabetancur12@gmail.com' }, // Cambia el email si es necesario
  });

  if (!existingAdmin) {
    // Crear contraseña hashada
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt); // Cambia la contraseña si es necesario

    // Crear el usuario Platform Admin
    const admin = await prisma.user.create({
      data: {
        email: 'jabetancur12@gmail.com', // Cambia el email si es necesario
        password: hashedPassword,
        name: 'Platform Admin',
        isPlatformAdmin: true,
        roles: {
          create: {
            role: { connect: { name: RoleType.PLATFORM_ADMIN } },
          },
        },
      },
    });

    console.log('Platform Admin creado:', admin);
  } else {
    console.log('Platform Admin ya existe');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

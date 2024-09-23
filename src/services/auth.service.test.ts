import * as AuthService from './auth.service';
import prismaMock from '../lib/__mocks__/prisma';
import { RoleType } from '@prisma/client';
import { beforeEach, describe, expect, it } from 'vitest';
import { vi } from 'vitest';
import bcrypt from 'bcryptjs';

vi.mock('../lib/prisma');
vi.mock('bcryptjs', () => ({
  default: {
    genSalt: vi.fn(),
    hash: vi.fn(),
    compare: vi.fn(),
  },
}));

vi.mock('jsonwebtoken', () => ({
  sign: vi.fn(),
}));

describe('AuthService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('email must be unique', () => {
    it('should throw an error if email is already registered', async () => {
      const email = 'jabetancur123@gmail.com';
      const password = 'hashedPassword123';
      const name = 'Platform Admin';

      prismaMock.user.findFirst.mockResolvedValue({
        id: 1,
        email,
        password,
        name,
        role: RoleType.PLATFORM_ADMIN,
        createdAt: new Date(),
        updatedAt: new Date(),
        ownerId: null,
      });

      expect(async () => {
        await AuthService.registerPlatformAdmin(email, password, name);
      }).rejects.toThrow('El usuario ya está registrado');
    });
  });

  describe('registerPlatformAdmin', () => {
    it('should register a new platform admin', async () => {
      const email = 'jabetancur123@gmail.com';
      const password = 'hashedPassword123';
      const name = 'Platform Admin';

      const salt = 'randomSalt';
      const hashedPassword = 'hashedPassword123';
      (bcrypt.genSalt as any).mockResolvedValue(salt);
      (bcrypt.hash as any).mockResolvedValue(hashedPassword);

      const user = {
        id: 1,
        email,
        password,
        name,
        role: RoleType.PLATFORM_ADMIN,
        createdAt: new Date(),
        updatedAt: new Date(),
        ownerId: null,
        tenantId: null,
        ownerUsers: null,
        platformAdmin: null,
      };

      prismaMock.user.create.mockResolvedValue(user);

      const result = await AuthService.registerPlatformAdmin(email, password, name);

      expect(result.email).toEqual(user.email);
      expect(result.name).toEqual(user.name);
      expect(result.role).toEqual(user.role);
      expect(result.ownerId).toEqual(user.ownerId);
    });
  });

  describe('loginAdmin', () => {
    it('should login a platform admin', async () => {
      const email = 'jabetancur123@gmail.com';
      const password = 'hashedPassword123';

      prismaMock.platformAdmin.findFirst.mockResolvedValue({
        id: 1,
        userId: 1,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        user: {
          id: 1,
          name: 'Platform Admin',
          email: 'jabetancur12@gmail.com',
          password: 'hashedPassword123',
          role: 'PLATFORM_ADMIN',
          ownerId: null,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
      });

      vi.mocked(bcrypt.compare).mockResolvedValue();

      const result = await AuthService.loginAdmin(email, password);

      expect(result).toEqual('token');
    });
  });
});

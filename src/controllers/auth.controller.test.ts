import * as AuthService from '../services/auth.service';
import * as AuthController from '../controllers/auth.controller';
import prismaMock from '../lib/__mocks__/prisma';
import { RoleType } from '@prisma/client';
import { beforeEach, describe, expect, it } from 'vitest';
import { vi } from 'vitest';
import bcrypt from 'bcryptjs';
import type { Request, Response } from 'express';

vi.mock('../services/auth.service', () => ({
  registerPlatformAdmin: vi.fn(),
}));

describe('auth.controller', () => {
  let request: Request;
  let response: Response;
  const next = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
    response = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    request = {
      body: {
        name: 'Platform Admin',
        email: 'jabetancur123@gmail.com',
        password: 'hashedPassword123',
      },
    } as Request;
  });

  describe('registerPlatformAdmin', () => {
    it('should register a new platform admin', async () => {
      const email = 'jabetancur123@gmail.com';
      const password = 'hashedPassword123';
      const name = 'Platform Admin';

      // Mock the AuthService response
      vi.mocked(AuthService.registerPlatformAdmin).mockResolvedValueOnce({
        id: 1,
        email,
        password,
        name,
        ownerId: null,
        role: RoleType.PLATFORM_ADMIN,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });

      // Call the controller
      await AuthController.registerPlatformAdmin(request, response, next);

      // Verify the service was called with correct parameters
      expect(AuthService.registerPlatformAdmin).toHaveBeenCalledWith(email, password, name);

      // Verify the response was sent correctly
      expect(response.status).toHaveBeenCalledWith(201);
      expect(response.json).toHaveBeenCalledWith({
        message: 'Administrador registrado con éxito',
        admin: {
          id: 1,
          email,
          name,
          password,
          role: RoleType.PLATFORM_ADMIN,
          ownerId: null,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
      });
    });
  });

  // describe('login', () => {
  //     it('should login a regular user', async () => {
  //         const email = 'jabetancur123@gmail.com';
  //         const password = 'hashedPassword123';
  //         const domain = 'example.com';

  //         // Mock the AuthService response
  //         vi.mocked(AuthService.login).mockResolvedValueOnce('token');

  //         // Call the controller
  //         await AuthController.login(request, response, next);

  //         // Verify the service was called with correct parameters
  //         expect(AuthService.login).toHaveBeenCalledWith(email, password, domain);

  //         // Verify the response was sent correctly
  //         expect(response.status).toHaveBeenCalledWith(200);
  //         expect(response.json).toHaveBeenCalledWith({
  //           message: 'Inicio de sesión exitoso',
  //           token: 'token',
  //         });
  //     });
  // });
});

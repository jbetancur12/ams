"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.registerAdmin = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
const prisma = new client_1.PrismaClient();
const registerAdmin = async (req, res) => {
    const { name, email, password } = req.body;
    // Validar que todos los campos estén presentes
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
    try {
        // Verificar si ya existe un usuario con el mismo correo
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }
        // Hashear la contraseña
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        // Crear el nuevo usuario con el rol SUPER_ADMIN
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                roles: {
                    create: {
                        role: {
                            connect: { name: 'SUPER_ADMIN' }
                        }
                    }
                }
            }
        });
        // Generar el token JWT
        const token = jsonwebtoken_1.default.sign({ userId: newUser.id }, config_1.config.JWT_SECRET, {
            expiresIn: '1h',
        });
        // Devolver la respuesta con el token
        return res.status(201).json({
            message: 'Usuario registrado exitosamente',
            token,
        });
    }
    catch (error) {
        return res.status(500).json({ message: 'Error en el servidor', error });
    }
};
exports.registerAdmin = registerAdmin;
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
    try {
        // Buscar el usuario por su email
        const user = await prisma.user.findUnique({ where: { email }, include: { roles: true } });
        if (!user) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }
        // Comparar la contraseña
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }
        // Generar el token JWT     
        const token = jsonwebtoken_1.default.sign({ userId: user.id, roles: user.roles }, config_1.config.JWT_SECRET, {
            expiresIn: '1h',
        });
        // Devolver el token y los datos del usuario
        return res.status(200).json({
            message: 'Inicio de sesión exitoso',
            token,
        });
    }
    catch (error) {
        return res.status(500).json({ message: 'Error en el servidor', error });
    }
};
exports.login = login;

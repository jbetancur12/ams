"use strict";
// src/middleware/authMiddleware.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = authenticateToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';
// Middleware para verificar el token JWT
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null)
        return res.sendStatus(401); // Si no hay token, no autorizado
    jsonwebtoken_1.default.verify(token, SECRET_KEY, (err, decoded) => {
        if (err)
            return res.sendStatus(403); // Token no válido
        // Asegúrate de que decoded no sea undefined y tenga el tipo JwtPayload
        const user = decoded;
        // Añadimos el usuario al request
        req.user = user;
        next();
    });
}

// import 'module-alias/register';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

import logger from './utils/logger';
import authRoutes from './routes/authRoutes';

import { errorHandler } from './middlewares/errorMiddleware';
import cookieParser from 'cookie-parser';

import rentalRoutes from './routes/rentalRoutes';
import maintenanceRoutes from './routes/maintenanceRoutes';
import userRoutes from './routes/user.routes';
import tenantRoutes from './routes/tenant.routes';
import ownerRoutes from './routes/ownerRoutes';
import ownerUserRoutes from './routes/ownerUser.routes';

// Cargar variables de entorno
dotenv.config();

const PORT: number = parseInt(process.env.PORT as string, 10) || 5000;

const app = express();

// CORS Middleware
const corsOptions = {
  origin: process.env.APP_ENV == 'developement' ? '*' : process.env.ORIGIN,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cookie parser middleware
app.use(cookieParser());

// Rutas de autenticación
app.use('/api/auth', authRoutes);

app.use('/api/rentals', rentalRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api/owners', ownerRoutes);
app.use('/api/owners-users', ownerUserRoutes);

// Middleware de manejo de errores
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Listening on PORT ${PORT}`);
});

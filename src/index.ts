
// import 'module-alias/register';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

import authRoutes from './routes/authRoutes';


import {errorHandler} from './middlewares/errorMiddleware';
import cookieParser from 'cookie-parser';

import apartmentRoutes from './routes/apartmentRoutes';
import rentalRoutes from './routes/rentalRoutes';
import maintenanceRoutes from './routes/maintenanceRoutes';
import userRoutes from './routes/userRoutes';
import tenantRoutes from './routes/tenantRoutes';

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
app.use('/api/apartments',  apartmentRoutes);
app.use('/api/rentals',  rentalRoutes);
app.use('/api/maintenance',  maintenanceRoutes);
app.use('/api/users',  userRoutes);
app.use('/api/tenants',  tenantRoutes);

// Middleware de manejo de errores
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});

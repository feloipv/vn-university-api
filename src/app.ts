import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import cookieParser from 'cookie-parser';
import { errorHandler, notFoundHandler } from './middlewares/errorMiddleware';
import authRouter from '@/routes/auth';
import trainingFieldRouter from './routes/trainingField';
import universityRouter from './routes/university';
import majorRouter from './routes/major';

dotenv.config();

const basePath: string = '/api/v1';
const app = express();
app.use(cookieParser());

app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

app.use(`${basePath}`, authRouter);
app.use(`${basePath}`, trainingFieldRouter);
app.use(`${basePath}`, universityRouter);
app.use(`${basePath}`, majorRouter);

app.use(notFoundHandler);
app.use(errorHandler);

connectDB();

export default app;

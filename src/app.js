import dotenv from 'dotenv';

dotenv.config({ path: '.env.dev' });

import express from 'express';
import cookieParser from 'cookie-parser';
import createError from 'http-errors';
import logger from 'morgan';
import indexRouter from './routes';
import { connect } from "./db/connect.js";
import cors from 'cors';
connect();

const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors())
app.use('/api', indexRouter);
app.use((req, res, next) => {
  next(createError(404));
});

export default app;

import express from 'express';
import dotenv from 'dotenv';
import studentRouter from './routers/studentRouter.js';

dotenv.config({path: './.env'});

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/user', studentRouter);

export { app };
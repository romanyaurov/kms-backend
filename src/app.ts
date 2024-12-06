import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.config';
import usersRouter from './routes/users.routes';
import morgan from 'morgan';

dotenv.config();

const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use('/static', express.static(__dirname + '/public'));
app.use(cors());

connectDB();

app.use('/api/users', usersRouter);

export default app;

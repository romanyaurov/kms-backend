import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.config';
import usersRouter from './routes/users.routes';
import morgan from 'morgan';
import issuesRouter from './routes/issues.routes';
import projectsRouter from './routes/projects.routes';
import authRouter from './routes/auth.routes';
import cookieParser from 'cookie-parser';
import authenticate from './middlewares/auth.middleware';
import tasksRouter from './routes/tasks.routes';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use('/static', express.static(__dirname + '/public'));
app.use(cors());

connectDB();

app.use('/api', authRouter);
app.use('/api/users', authenticate, usersRouter);
app.use('/api/issues', authenticate, issuesRouter);
app.use('/api/tasks', authenticate, tasksRouter);
app.use('/api/projects', authenticate, projectsRouter);

export default app;

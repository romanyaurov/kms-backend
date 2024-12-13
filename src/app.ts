import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.config';
import usersRouter from './routes/users.routes';
import morgan from 'morgan';
import issuesRouter from './routes/issues.routes';
import projectsRouter from './routes/projects.routes';

dotenv.config();

const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use('/static', express.static(__dirname + '/public'));
app.use(cors());

connectDB();

app.use('/api/users', usersRouter);
app.use('/api/issues', issuesRouter);
app.use('/api/projects', projectsRouter);

export default app;

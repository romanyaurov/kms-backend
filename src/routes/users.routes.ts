import { Router } from 'express';
import UserController from '../controllers/user.controller';

const usersRouter = Router();

// usersRouter.get('/', UserController.getAllUsers);
// usersRouter.get('/me', UserController.getUserInfo);

export default usersRouter;

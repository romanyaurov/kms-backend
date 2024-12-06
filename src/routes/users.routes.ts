import { Router } from 'express';
import UserController from '../controllers/user.controller';

const usersRouter = Router();

usersRouter.get('/', UserController.getAllUsers);
usersRouter.get('/:id', UserController.getUser);
usersRouter.post('/', UserController.createUser);
usersRouter.delete('/:id', UserController.deleteUser);

export default usersRouter;

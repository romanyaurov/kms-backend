import { Router } from 'express';
import UserController from '../controllers/user.controller';
import { checkEmailValidator } from '../middlewares/check-email.validator';

const usersRouter = Router();

// usersRouter.get('/', UserController.getAllUsers);
// usersRouter.get('/me', UserController.getUserInfo);
usersRouter.post('/validate', checkEmailValidator, UserController.checkUser)

export default usersRouter;

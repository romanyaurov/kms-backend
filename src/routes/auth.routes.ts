import { Router } from 'express';
import AuthController from '../controllers/auth.controller';
import { validateLoginRequest } from '../middlewares/login-validator.middleware';
import { validateSignupRequest } from '../middlewares/signup-validator.middleware';
import authenticate from '../middlewares/auth.middleware';

const authRouter = Router();

authRouter.get('/user', authenticate, AuthController.userInfo);
authRouter.post('/signup', validateSignupRequest, AuthController.register);
authRouter.post('/login', validateLoginRequest, AuthController.login);
// authRouter.get('/refresh', AuthController.refresh);
authRouter.post('/logout', AuthController.logout);

export default authRouter;

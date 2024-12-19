import { Router } from 'express';
import AuthController from '../controllers/auth.controller';
import { validateLoginRequest } from '../middlewares/login-validator.middleware';
import { validateSignupRequest } from '../middlewares/signup-validator.middleware';

const authRouter = Router();

authRouter.post('/signup', validateSignupRequest, AuthController.register);
authRouter.post('/login', validateLoginRequest, AuthController.login);
authRouter.get('/refresh', AuthController.refresh);
authRouter.get('/logout', AuthController.logout);

export default authRouter;

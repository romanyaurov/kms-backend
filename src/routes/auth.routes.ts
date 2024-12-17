import { Router } from 'express';
import AuthController from '../controllers/auth.controller';

const authRouter = Router();

authRouter.post('/signup', AuthController.register);
authRouter.post('/login', AuthController.login);
authRouter.get('/refresh', AuthController.refresh);
authRouter.get('/logout', AuthController.logout);

export default authRouter;

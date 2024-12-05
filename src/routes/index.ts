import { Router } from 'express';
import helloController from '../controllers/helloController';

const router = Router();

router.get('/hello', helloController);

export default router;

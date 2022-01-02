import { Router } from 'express';
import loginRouter from './login.router';

const router = Router();

router.use('/login', loginRouter);

export default router;

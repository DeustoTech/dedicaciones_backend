import { Router } from 'express';
import openIdRouter from './openid';

const router = Router();

router.use('/open-id', openIdRouter);

export default router;

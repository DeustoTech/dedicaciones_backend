import { Router, Request, Response, NextFunction } from 'express';

import authRouter from './auth.router';
import authorizedRouter from './authorized.router';
import { validate } from '../middleware/validate.middleware';

const router = Router();
router.use('/auth', authRouter);
router.use('/authorized', validate, authorizedRouter);

export default router;

import { Router } from 'express';
import googleOpenIdRouter from './google.openid.router';

const router = Router();

router.use('/google', googleOpenIdRouter);

export default router;

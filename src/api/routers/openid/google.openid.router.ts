import { Router } from 'express';
import * as controller from '../../controllers/google.openid.controller';

const router = Router();

router.route('/').get(controller.getAuthorizationUrl);

router.route('/callback').get(controller.callback);

export default router;

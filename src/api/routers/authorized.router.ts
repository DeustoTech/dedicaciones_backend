import { Router } from 'express';
import * as controller from '../controllers/authorized.controller';
const router = Router();

router.route('/profile').get(controller.getUser);
router.route('/logout').delete(controller.logout);

export default router;

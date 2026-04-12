import { Router } from 'express';
import { AlertController } from './alert.controller';
import { authenticate } from '../../shared/middleware/auth.middleware';

const router = Router();
const alertController = new AlertController();

router.post('/', alertController.createAlert);
router.get('/', authenticate, alertController.getAllAlerts);
router.get('/:id', authenticate, alertController.getAlertById);
router.patch('/:id/acknowledge', authenticate, alertController.acknowledgeAlert);
router.patch('/:id/resolve', authenticate, alertController.resolveAlert);

export default router;
import { Router } from 'express';
import { EscalationPolicyController } from './escalation-policy.controller';
import { authenticate, authorizeAdmin } from '../../shared/middleware/auth.middleware';

const router = Router();
const escalationPolicyController = new EscalationPolicyController();

router.post('/', authenticate, authorizeAdmin, escalationPolicyController.createPolicy);
router.get('/:teamId', authenticate, escalationPolicyController.getPolicyByTeamId);
router.put('/:teamId', authenticate, authorizeAdmin, escalationPolicyController.updatePolicy);

export default router;
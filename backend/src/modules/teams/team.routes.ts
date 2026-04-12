import { Router } from 'express';
import { TeamController } from './team.controller';
import { authenticate, authorizeAdmin } from '../../shared/middleware/auth.middleware';

const router = Router();
const teamController = new TeamController();

router.post('/', authenticate, authorizeAdmin, teamController.createTeam);
router.get('/', authenticate, teamController.getAllTeams);
router.get('/:id', authenticate, teamController.getTeamById);
router.delete('/:id', authenticate, authorizeAdmin, teamController.deleteTeam);

export default router;
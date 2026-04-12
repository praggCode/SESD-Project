import { Router } from 'express';
import { UserController } from './user.controller';
import { authenticate, authorizeAdmin } from '../../shared/middleware/auth.middleware';

const router = Router();
const userController = new UserController();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/', authenticate, authorizeAdmin, userController.getAllUsers);
router.get('/:id', authenticate, userController.getUserById);

export default router;
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import logger from './shared/utils/logger';
import userRoutes from './modules/users/user.routes';
import teamRoutes from './modules/teams/team.routes';
import alertRoutes from './modules/alerts/alert.routes';
import escalationPolicyRoutes from './modules/escalation/escalation-policy.routes';

const app: Application = express();

app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: 'Too many requests, please try again later.',
});

app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', userRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/escalation-policies', escalationPolicyRoutes);
app.get('/health', (req: Request, res: Response) => {
  logger.info('Health check hit');
  res.status(200).json({
    status: 'ok',
    message: 'Sentinel API is running',
  });
});

export default app;
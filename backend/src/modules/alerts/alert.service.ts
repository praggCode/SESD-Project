import { AlertRepository } from './alert.repository';
import { IAlert, AlertStatus, Severity } from './alert.model';
import { TeamRepository } from '../teams/team.repository';
import { NotificationService } from '../notifications/notification.service';
import { UserRepository } from '../users/user.repository';
import logger from '../../shared/utils/logger';
import mongoose from 'mongoose';

export class AlertService {
  private alertRepository: AlertRepository;
  private teamRepository: TeamRepository;
  private notificationService: NotificationService;
  private userRepository: UserRepository;

  constructor() {
    this.alertRepository = new AlertRepository();
    this.teamRepository = new TeamRepository();
    this.notificationService = new NotificationService();
    this.userRepository = new UserRepository();
  }

  async createAlert(data: {
    title: string;
    message: string;
    severity: Severity;
    source: string;
    teamId: string;
  }): Promise<{ alert: IAlert; isDuplicate: boolean }> {

    const team = await this.teamRepository.findById(data.teamId);
    if (!team) {
      throw new Error('Team not found');
    }

    const duplicate = await this.alertRepository.findOpenDuplicate(
      data.title,
      data.source
    );

    if (duplicate) {
      await this.alertRepository.incrementDuplicateCount(
        (duplicate._id as mongoose.Types.ObjectId).toString()
      );
      logger.warn(`Duplicate alert received: ${data.title}`);
      return { alert: duplicate, isDuplicate: true };
    }

    const alert = await this.alertRepository.create({
      ...data,
      teamId: new mongoose.Types.ObjectId(data.teamId),
    });
    logger.info(`New alert created: ${alert.title} | Severity: ${alert.severity}`);

    const users = await this.userRepository.findAll();
    await this.notificationService.notify(users as any, alert);

    return { alert, isDuplicate: false };
  }

  async getAllAlerts(): Promise<IAlert[]> {
    return await this.alertRepository.findAll();
  }

  async getAlertById(id: string): Promise<IAlert> {
    const alert = await this.alertRepository.findById(id);
    if (!alert) {
      throw new Error('Alert not found');
    }
    return alert;
  }

  async acknowledgeAlert(alertId: string, userId: string): Promise<IAlert> {
    const alert = await this.alertRepository.findById(alertId);
    if (!alert) {
      throw new Error('Alert not found');
    }

    if (alert.status === AlertStatus.ACKNOWLEDGED) {
      throw new Error('Alert already acknowledged');
    }

    if (alert.status === AlertStatus.RESOLVED) {
      throw new Error('Alert already resolved');
    }

    const updated = await this.alertRepository.updateStatus(alertId, {
      status: AlertStatus.ACKNOWLEDGED,
      acknowledgedBy: userId as any,
      acknowledgedAt: new Date(),
    });

    logger.info(`Alert acknowledged: ${alertId} by user: ${userId}`);
    return updated!;
  }

  async resolveAlert(alertId: string): Promise<IAlert> {
    const alert = await this.alertRepository.findById(alertId);
    if (!alert) {
      throw new Error('Alert not found');
    }

    if (alert.status === AlertStatus.RESOLVED) {
      throw new Error('Alert already resolved');
    }

    const updated = await this.alertRepository.updateStatus(alertId, {
      status: AlertStatus.RESOLVED,
      resolvedAt: new Date(),
    });

    logger.info(`Alert resolved: ${alertId}`);
    return updated!;
  }
}
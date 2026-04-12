import { NotificationChannel } from './channels/channel.interface';
import { IUser } from '../users/user.model';
import { IAlert } from '../alerts/alert.model';
import { EmailChannel } from './channels/email.channel';
import logger from '../../shared/utils/logger';

export class NotificationService {
  private channels: NotificationChannel[];

  constructor() {
    this.channels = [];
    this.channels.push(new EmailChannel());
  }

  async notify(users: IUser[], alert: IAlert): Promise<void> {
    for (const user of users) {
      for (const channel of this.channels) {
        try {
          const success = await channel.send(user, alert);
          if (!success) {
            logger.warn(`Channel failed for user ${user.email}`);
          }
        } catch (error) {
          logger.error(`Notification error: ${error}`);
        }
      }
    }
  }
}
import { Resend } from 'resend';
import { NotificationChannel } from './channel.interface';
import { IUser } from '../../users/user.model';
import { IAlert } from '../../alerts/alert.model';
import { env } from '../../../config/env';
import logger from '../../../shared/utils/logger';

export class EmailChannel implements NotificationChannel {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(env.RESEND_API_KEY);
  }

  async send(user: IUser, alert: IAlert): Promise<boolean> {
    try {
      await this.resend.emails.send({
        from: env.RESEND_FROM_EMAIL,
        to: user.email,
        subject: `🚨 [${alert.severity}] ${alert.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: red;">🚨 Sentinel Alert</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td><strong>Title:</strong></td>
                <td>${alert.title}</td>
              </tr>
              <tr>
                <td><strong>Severity:</strong></td>
                <td>${alert.severity}</td>
              </tr>
              <tr>
                <td><strong>Source:</strong></td>
                <td>${alert.source}</td>
              </tr>
              <tr>
                <td><strong>Message:</strong></td>
                <td>${alert.message}</td>
              </tr>
              <tr>
                <td><strong>Status:</strong></td>
                <td>${alert.status}</td>
              </tr>
              <tr>
                <td><strong>Time:</strong></td>
                <td>${alert.createdAt}</td>
              </tr>
            </table>
            <p style="color: gray; margin-top: 20px;">
              Please acknowledge this alert immediately.
            </p>
          </div>
        `,
      });

      logger.info(`Email sent to ${user.email} for alert: ${alert.title}`);
      return true;

    } catch (error) {
      logger.error(`Failed to send email to ${user.email}: ${error}`);
      return false;
    }
  }
}
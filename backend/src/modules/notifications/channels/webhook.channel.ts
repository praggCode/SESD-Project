import { NotificationChannel } from './channel.interface';
import { IUser } from '../../users/user.model';
import { IAlert } from '../../alerts/alert.model';
import logger from '../../../shared/utils/logger';

export class WebhookChannel implements NotificationChannel {
  private webhookUrl: string;

  constructor(webhookUrl: string) {
    this.webhookUrl = webhookUrl;
  }

  async send(user: IUser, alert: IAlert): Promise<boolean> {
    try {
      const payload = {
        content: `🚨 **SENTINEL ALERT**`,
        embeds: [
          {
            title: `${alert.title}`,
            color: this.getSeverityColor(alert.severity),
            fields: [
              { name: '🔴 Severity', value: alert.severity, inline: true },
              { name: '📡 Source', value: alert.source, inline: true },
              { name: '📋 Status', value: alert.status, inline: true },
              { name: '👤 Assigned To', value: user.name, inline: true },
              { name: '💬 Message', value: alert.message, inline: false },
            ],
            timestamp: new Date().toISOString(),
          },
        ],
      };

      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Webhook responded with status: ${response.status}`);
      }

      logger.info(`Webhook sent to ${this.webhookUrl} for alert: ${alert.title}`);
      return true;

    } catch (error) {
      logger.error(`Failed to send webhook: ${error}`);
      return false;
    }
  }

  private getSeverityColor(severity: string): number {
    const colors: Record<string, number> = {
      LOW: 0x00ff00,      // green
      MEDIUM: 0xffa500,   // orange
      HIGH: 0xff4500,     // red-orange
      CRITICAL: 0xff0000, // red
    };
    return colors[severity] ?? 0xff0000;
  }
}
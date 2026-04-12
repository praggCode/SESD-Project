import { IUser } from '../../users/user.model';
import { IAlert } from '../../alerts/alert.model';

export interface NotificationChannel {
  send(user: IUser, alert: IAlert): Promise<boolean>;
}
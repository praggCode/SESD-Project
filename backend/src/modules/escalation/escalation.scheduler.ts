import { Job } from "agenda";
import mongoose from "mongoose";
import agenda from "../../config/agenda";
import { AlertRepository } from "../alerts/alert.repository";
import { EscalationPolicyRepository } from "./escalation-policy.repository";
import { NotificationService } from "../notifications/notification.service";
import { UserRepository } from "../users/user.repository";
import { AlertStatus } from "../alerts/alert.model";
import logger from "../../shared/utils/logger";

const ESCALATION_JOB = "escalate-alert";

const getTeamId = (
  teamId: mongoose.Types.ObjectId | string | { _id: mongoose.Types.ObjectId },
): string => {
  if (typeof teamId === "string") {
    return teamId;
  }

  if (
    typeof teamId === "object" &&
    teamId !== null &&
    "_id" in teamId &&
    teamId._id instanceof mongoose.Types.ObjectId
  ) {
    return teamId._id.toString();
  }

  return teamId.toString();
};

const alertRepository = new AlertRepository();
const escalationPolicyRepository = new EscalationPolicyRepository();
const notificationService = new NotificationService();
const userRepository = new UserRepository();

export const defineEscalationJob = (): void => {
  agenda.define(ESCALATION_JOB, async (job: Job) => {
    const { alertId, level } = job.attrs.data as {
      alertId: string;
      level: number;
    };

    try {
      const alert = await alertRepository.findById(alertId);
      if (!alert) {
        logger.warn(`Escalation job: Alert ${alertId} not found`);
        return;
      }

      if (
        alert.status === AlertStatus.ACKNOWLEDGED ||
        alert.status === AlertStatus.RESOLVED
      ) {
        logger.info(
          `Escalation cancelled — alert ${alertId} already ${alert.status}`,
        );
        return;
      }

      const teamId = getTeamId(alert.teamId);

      const policy = await escalationPolicyRepository.findByTeamId(teamId);
      if (!policy) {
        logger.warn(`No escalation policy for team ${alert.teamId}`);
        return;
      }

      const escalationLevel = policy.levels.find(
        (l) => l.levelNumber === level,
      );
      if (!escalationLevel) {
        logger.info(`No more escalation levels for alert ${alertId}`);
        return;
      }

      const users = await Promise.all(
        escalationLevel.userIds.map((userId) =>
          userRepository.findById(userId.toString()),
        ),
      );
      const validUsers = users.filter((u) => u !== null) as any[];
      await notificationService.notify(validUsers, alert);
      logger.info(`Escalated alert ${alertId} to level ${level}`);

      const nextLevel = policy.levels.find((l) => l.levelNumber === level + 1);
      if (nextLevel) {
        await agenda.schedule(
          `in ${nextLevel.delayMinutes} minutes`,
          ESCALATION_JOB,
          { alertId, level: level + 1 },
        );
      }
    } catch (error) {
      logger.error(`Escalation job error: ${error}`);
    }
  });
};

export const scheduleEscalation = async (
  alertId: string,
  delayMinutes: number,
): Promise<void> => {
  await agenda.schedule(`in ${delayMinutes} minutes`, ESCALATION_JOB, {
    alertId,
    level: 1,
  });
  logger.info(
    `Escalation scheduled for alert ${alertId} in ${delayMinutes} minutes`,
  );
};

export const cancelEscalation = async (alertId: string): Promise<void> => {
  await agenda.cancel({ "data.alertId": alertId });
  logger.info(`Escalation cancelled for alert ${alertId}`);
};

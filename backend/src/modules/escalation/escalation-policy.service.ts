import { EscalationPolicyRepository } from "./escalation-policy.repository";
import { IEscalationPolicy, IEscalationLevel } from "./escalation-policy.model";
import { TeamRepository } from "../teams/team.repository";
import logger from "../../shared/utils/logger";
import mongoose from "mongoose";

export class EscalationPolicyService {
  private escalationPolicyRepository: EscalationPolicyRepository;
  private teamRepository: TeamRepository;

  constructor() {
    this.escalationPolicyRepository = new EscalationPolicyRepository();
    this.teamRepository = new TeamRepository();
  }

  async createPolicy(data: {
    teamId: string;
    levels: IEscalationLevel[];
  }): Promise<IEscalationPolicy> {

    const team = await this.teamRepository.findById(data.teamId);
    if (!team) {
      throw new Error("Team not found");
    }

    const existing = await this.escalationPolicyRepository.findByTeamId(
      data.teamId,
    );
    if (existing) {
      throw new Error("Escalation policy already exists for this team");
    }

    const sorted = data.levels.every((level, index) => {
      return level.levelNumber === index + 1;
    });
    if (!sorted) {
      throw new Error("Level numbers must be sequential starting from 1");
    }

    const policy = await this.escalationPolicyRepository.create({
      ...data,
      teamId: new mongoose.Types.ObjectId(data.teamId),
    });
    logger.info(`Escalation policy created for team: ${data.teamId}`);
    return policy;
  }

  async getPolicyByTeamId(teamId: string): Promise<IEscalationPolicy> {
    const policy = await this.escalationPolicyRepository.findByTeamId(teamId);
    if (!policy) {
      throw new Error("Escalation policy not found for this team");
    }
    return policy;
  }

  async updatePolicy(
    teamId: string,
    levels: IEscalationLevel[],
  ): Promise<IEscalationPolicy> {
    const policy = await this.escalationPolicyRepository.update(teamId, {
      levels,
    });
    if (!policy) {
      throw new Error("Escalation policy not found");
    }
    logger.info(`Escalation policy updated for team: ${teamId}`);
    return policy;
  }
}

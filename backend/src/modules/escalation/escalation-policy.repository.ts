import EscalationPolicy, { IEscalationPolicy } from "./escalation-policy.model";

export class EscalationPolicyRepository {
  async create(data: Partial<IEscalationPolicy>): Promise<IEscalationPolicy> {
    const policy = new EscalationPolicy(data);
    return await policy.save();
  }

  async findByTeamId(teamId: string): Promise<IEscalationPolicy | null> {
    return await EscalationPolicy.findOne({ teamId }).lean();
  }

  async findById(id: string): Promise<IEscalationPolicy | null> {
    return await EscalationPolicy.findById(id);
  }

  async update(
    teamId: string,
    data: Partial<IEscalationPolicy>,
  ): Promise<IEscalationPolicy | null> {
    return await EscalationPolicy.findOneAndUpdate({ teamId }, data, {
      new: true,
    });
  }

  async deleteByTeamId(teamId: string): Promise<void> {
    await EscalationPolicy.findOneAndDelete({ teamId });
  }
}

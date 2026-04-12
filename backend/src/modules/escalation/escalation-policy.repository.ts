import EscalationPolicy, { IEscalationPolicy } from './escalation-policy.model';

export class EscalationPolicyRepository {
  async create(data: Partial<IEscalationPolicy>): Promise<IEscalationPolicy> {
    const policy = new EscalationPolicy(data);
    return await policy.save();
  }

  async findByTeamId(teamId: string): Promise<IEscalationPolicy | null> {
    return await EscalationPolicy.findOne({ teamId })
      .populate('levels.userIds', 'name email');
  }

  async findById(id: string): Promise<IEscalationPolicy | null> {
    return await EscalationPolicy.findById(id)
      .populate('levels.userIds', 'name email');
  }

  async update(
    teamId: string,
    data: Partial<IEscalationPolicy>
  ): Promise<IEscalationPolicy | null> {
    return await EscalationPolicy.findOneAndUpdate(
      { teamId },
      data,
      { new: true }
    );
  }

  async deleteByTeamId(teamId: string): Promise<void> {
    await EscalationPolicy.findOneAndDelete({ teamId });
  }
}
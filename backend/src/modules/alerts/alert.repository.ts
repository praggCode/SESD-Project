import Alert, { IAlert, AlertStatus } from './alert.model';

export class AlertRepository {
  async create(data: Partial<IAlert>): Promise<IAlert> {
    const alert = new Alert(data);
    return await alert.save();
  }

  async findOpenDuplicate(title: string, source: string): Promise<IAlert | null> {
    return await Alert.findOne({
      title,
      source,
      status: { $in: [AlertStatus.TRIGGERED, AlertStatus.NOTIFIED] },
    });
  }

  async incrementDuplicateCount(id: string): Promise<void> {
    await Alert.findByIdAndUpdate(id, { $inc: { duplicateCount: 1 } });
  }

  async findAll(): Promise<IAlert[]> {
    return await Alert.find()
      .populate('teamId', 'name')
      .populate('acknowledgedBy', 'name email')
      .sort({ createdAt: -1 });
  }

  async findById(id: string): Promise<IAlert | null> {
    return await Alert.findById(id)
      .populate('teamId', 'name')
      .populate('acknowledgedBy', 'name email');
  }

  async findActiveByTeam(teamId: string): Promise<IAlert[]> {
    return await Alert.find({
      teamId,
      status: { $in: [AlertStatus.TRIGGERED, AlertStatus.NOTIFIED] },
    }).sort({ createdAt: -1 });
  }

  async updateStatus(
    id: string,
    data: Partial<IAlert>
  ): Promise<IAlert | null> {
    return await Alert.findByIdAndUpdate(id, data, { new: true });
  }
}
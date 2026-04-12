import Team, { ITeam } from './team.model';

export class TeamRepository {
  async create(data: Partial<ITeam>): Promise<ITeam> {
    const team = new Team(data);
    return await team.save();
  }

  async findAll(): Promise<ITeam[]> {
    return await Team.find();
  }

  async findById(id: string): Promise<ITeam | null> {
    return await Team.findById(id);
  }

  async findByName(name: string): Promise<ITeam | null> {
    return await Team.findOne({ name });
  }

  async deleteById(id: string): Promise<void> {
    await Team.findByIdAndDelete(id);
  }
}
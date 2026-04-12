import { TeamRepository } from './team.repository';
import { ITeam } from './team.model';
import logger from '../../shared/utils/logger';

export class TeamService {
  private teamRepository: TeamRepository;

  constructor() {
    this.teamRepository = new TeamRepository();
  }

  async createTeam(data: { name: string }): Promise<ITeam> {
    const existing = await this.teamRepository.findByName(data.name);
    if (existing) {
      throw new Error('Team name already exists');
    }
    const team = await this.teamRepository.create(data);
    logger.info(`New team created: ${team.name}`);
    return team;
  }

  async getAllTeams(): Promise<ITeam[]> {
    return await this.teamRepository.findAll();
  }

  async getTeamById(id: string): Promise<ITeam> {
    const team = await this.teamRepository.findById(id);
    if (!team) {
      throw new Error('Team not found');
    }
    return team;
  }

  async deleteTeam(id: string): Promise<void> {
    const team = await this.teamRepository.findById(id);
    if (!team) {
      throw new Error('Team not found');
    }
    await this.teamRepository.deleteById(id);
    logger.info(`Team deleted: ${team.name}`);
  }
}
import { Response } from 'express';
import { TeamService } from './team.service';
import { AuthRequest } from '../../shared/middleware/auth.middleware';

export class TeamController {
  private teamService: TeamService;

  constructor() {
    this.teamService = new TeamService();
  }

  createTeam = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const team = await this.teamService.createTeam(req.body);
      res.status(201).json({
        success: true,
        message: 'Team created successfully',
        data: team,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  getAllTeams = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const teams = await this.teamService.getAllTeams();
      res.status(200).json({
        success: true,
        data: teams,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  getTeamById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const team = await this.teamService.getTeamById(id);
      res.status(200).json({
        success: true,
        data: team,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  };

  deleteTeam = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      await this.teamService.deleteTeam(id);
      res.status(200).json({
        success: true,
        message: 'Team deleted successfully',
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  };
}
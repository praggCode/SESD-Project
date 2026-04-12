import { Response } from 'express';
import { EscalationPolicyService } from './escalation-policy.service';
import { AuthRequest } from '../../shared/middleware/auth.middleware';

export class EscalationPolicyController {
  private escalationPolicyService: EscalationPolicyService;

  constructor() {
    this.escalationPolicyService = new EscalationPolicyService();
  }

  createPolicy = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const policy = await this.escalationPolicyService.createPolicy(req.body);
      res.status(201).json({
        success: true,
        message: 'Escalation policy created successfully',
        data: policy,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  getPolicyByTeamId = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { teamId } = req.params as { teamId: string };
      const policy = await this.escalationPolicyService.getPolicyByTeamId(teamId);
      res.status(200).json({
        success: true,
        data: policy,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  };

  updatePolicy = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { teamId } = req.params as { teamId: string };
      const policy = await this.escalationPolicyService.updatePolicy(
        teamId,
        req.body.levels
      );
      res.status(200).json({
        success: true,
        message: 'Escalation policy updated successfully',
        data: policy,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };
}
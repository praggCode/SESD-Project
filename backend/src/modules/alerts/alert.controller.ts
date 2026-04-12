import { Response } from 'express';
import { AlertService } from './alert.service';
import { AuthRequest } from '../../shared/middleware/auth.middleware';

export class AlertController {
  private alertService: AlertService;

  constructor() {
    this.alertService = new AlertService();
  }

  createAlert = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { alert, isDuplicate } = await this.alertService.createAlert(req.body);
      res.status(isDuplicate ? 200 : 201).json({
        success: true,
        isDuplicate,
        message: isDuplicate ? 'Duplicate alert detected' : 'Alert created successfully',
        data: alert,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  getAllAlerts = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const alerts = await this.alertService.getAllAlerts();
      res.status(200).json({
        success: true,
        data: alerts,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  getAlertById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const alert = await this.alertService.getAlertById(id);
      res.status(200).json({
        success: true,
        data: alert,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  };

  acknowledgeAlert = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const userId = req.user!.id;
      const alert = await this.alertService.acknowledgeAlert(id, userId);
      res.status(200).json({
        success: true,
        message: 'Alert acknowledged',
        data: alert,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  resolveAlert = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const alert = await this.alertService.resolveAlert(id);
      res.status(200).json({
        success: true,
        message: 'Alert resolved',
        data: alert,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };
}
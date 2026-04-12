import mongoose, { Document, Schema } from 'mongoose';

export enum Severity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum AlertStatus {
  TRIGGERED = 'TRIGGERED',
  NOTIFIED = 'NOTIFIED',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  RESOLVED = 'RESOLVED',
}

export interface IAlert extends Document {
  title: string;
  message: string;
  severity: Severity;
  status: AlertStatus;
  source: string;
  teamId: mongoose.Types.ObjectId;
  acknowledgedBy?: mongoose.Types.ObjectId;
  acknowledgedAt?: Date;
  resolvedAt?: Date;
  duplicateCount: number;
  createdAt: Date;
}

const alertSchema = new Schema<IAlert>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
    },
    severity: {
      type: String,
      enum: Object.values(Severity),
      required: [true, 'Severity is required'],
    },
    status: {
      type: String,
      enum: Object.values(AlertStatus),
      default: AlertStatus.TRIGGERED,
    },
    source: {
      type: String,
      required: [true, 'Source is required'],
      trim: true,
    },
    teamId: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
      required: [true, 'Team is required'],
    },
    acknowledgedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    acknowledgedAt: {
      type: Date,
    },
    resolvedAt: {
      type: Date,
    },
    duplicateCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Alert = mongoose.model<IAlert>('Alert', alertSchema);

export default Alert;
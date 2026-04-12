import mongoose, { Document, Schema } from 'mongoose';

export interface IEscalationLevel {
  levelNumber: number;
  delayMinutes: number;
  userIds: mongoose.Types.ObjectId[];
}

export interface IEscalationPolicy extends Document {
  teamId: mongoose.Types.ObjectId;
  levels: IEscalationLevel[];
  createdAt: Date;
}

const escalationLevelSchema = new Schema<IEscalationLevel>({
  levelNumber: {
    type: Number,
    required: true,
  },
  delayMinutes: {
    type: Number,
    required: true,
  },
  userIds: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
});

const escalationPolicySchema = new Schema<IEscalationPolicy>(
  {
    teamId: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
      required: true,
      unique: true,
    },
    levels: [escalationLevelSchema],
  },
  {
    timestamps: true,
  }
);

const EscalationPolicy = mongoose.model<IEscalationPolicy>(
  'EscalationPolicy',
  escalationPolicySchema
);

export default EscalationPolicy;
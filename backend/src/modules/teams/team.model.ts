import mongoose, { Document, Schema } from 'mongoose';

export interface ITeam extends Document {
  name: string;
  createdAt: Date;
}

const teamSchema = new Schema<ITeam>(
  {
    name: {
      type: String,
      required: [true, 'Team name is required'],
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Team = mongoose.model<ITeam>('Team', teamSchema);

export default Team;
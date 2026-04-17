import User, { IUser } from "./user.model";

export class UserRepository {
  async create(data: Partial<IUser>): Promise<IUser> {
    const user = new User(data);
    return await user.save();
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }

  async findById(id: string): Promise<IUser | null> {
    return await User.findById(id).select("-password");
  }

  async findAll(): Promise<IUser[]> {
    return await User.find().select("-password");
  }

  async findByTeamId(teamId: string): Promise<IUser[]> {
    return await User.find({ teamId }).select("-password");
  }
}

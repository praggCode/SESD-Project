import bcrypt from 'bcryptjs';
import { UserRepository } from './user.repository';
import { IUser, UserRole } from './user.model';
import logger from '../../shared/utils/logger';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(data: {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
  }): Promise<IUser> {
    const existing = await this.userRepository.findByEmail(data.email);
    if (existing) {
      throw new Error('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.userRepository.create({
      ...data,
      password: hashedPassword,
    });

    logger.info(`New user registered: ${user.email}`);
    return user;
  }

  async getAllUsers(): Promise<IUser[]> {
    return await this.userRepository.findAll();
  }

  async getUserById(id: string): Promise<IUser> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}
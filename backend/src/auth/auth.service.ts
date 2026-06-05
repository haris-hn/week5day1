import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async register(username: string, password: string) {
    const exists = await this.userModel.findOne({ username });

    if (exists) throw new ConflictException('User already exists');

    const user = await this.userModel.create({ username, password });
    return user;
  }

  async login(username: string, password: string) {
    const user = await this.userModel.findOne({ username, password });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    return user;
  }
}
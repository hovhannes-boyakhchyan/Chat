import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas';
import { SignUpDto } from '../../api/auth/dtos';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async createUser(userData: SignUpDto): Promise<User> {
    const isExists = await this.userModel.exists({
      $or: [{ email: userData.email }, { userName: userData.userName }],
    });
    if (isExists) throw new BadRequestException('User already exists.');
    return this.userModel.create(userData);
  }

  getUsers(): Promise<User[]> {
    return this.userModel.find();
  }

  getUserByParams(userData): Promise<User> {
    return this.userModel.findOne({ ...userData });
  }
}

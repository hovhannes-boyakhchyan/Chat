import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { UsersRepository } from '../../common/repositories';
import { User } from '../../common/schemas';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  getAllUsers(): Promise<User[]> {
    return this.usersRepository.getUsers();
  }

  getUsersById(userId: ObjectId): Promise<User> {
    return this.usersRepository.getUserByParams({ _id: userId });
  }
}

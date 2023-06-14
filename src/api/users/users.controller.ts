import { Controller, Get, Param } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { ValidationMongoIdPipe } from '../../common/pipes';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Get all users
   * @returns
   */
  @Get()
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  /**
   * Get user by id
   * @returns
   */
  @Get(':id')
  getUsersById(@Param('id', ValidationMongoIdPipe) userId: ObjectId) {
    return this.usersService.getUsersById(userId);
  }
}

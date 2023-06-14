import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Messages, MessagesDocument } from '../schemas';
import { Model } from 'mongoose';
import { ICreateNewMessage } from '../interfaces';

@Injectable()
export class MessagesRepository {
  constructor(
    @InjectModel(Messages.name)
    private readonly messagesModel: Model<MessagesDocument>,
  ) {}

  create(messageData: ICreateNewMessage): Promise<Messages> {
    return this.messagesModel.create(messageData);
  }
}

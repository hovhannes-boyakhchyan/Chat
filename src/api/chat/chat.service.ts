import { Injectable } from '@nestjs/common';
import { MessagesRepository } from '../../common/repositories';
import { ICreateNewMessage } from '../../common/interfaces';

@Injectable()
export class ChatService {
  constructor(private readonly messagesRepository: MessagesRepository) {}

  async createNewMessage(messageData: ICreateNewMessage) {
    return this.messagesRepository.create(messageData);
  }
}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { AuthModule } from '../auth/auth.module';
import { MessagesRepository } from '../../common/repositories';
import { Messages, MessagesSchema } from '../../common/schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Messages.name, schema: MessagesSchema },
    ]),
    AuthModule,
  ],
  providers: [ChatGateway, ChatService, MessagesRepository],
})
export class ChatModule {}

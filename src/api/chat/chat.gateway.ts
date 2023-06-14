import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger, OnModuleInit, UseFilters, UsePipes } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthService } from '../auth/auth.service';
import { WsNewMessagePipe } from '../../common/pipes';
import { WsExceptionFilter } from '../../common/exceptions';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnModuleInit {
  private logger: Logger = new Logger();
  private connectedUsers = {};

  constructor(
    private readonly chatService: ChatService,
    private readonly authService: AuthService,
  ) {}

  @WebSocketServer()
  server: Server;

  onModuleInit(): any {
    this.server
      .use(async (client: Socket, next) => {
        const token = client.handshake?.headers?.auth;
        const user = await this.authService.validateToken(token);
        if (user) {
          client['userId'] = user._id.toString();
          next();
        }
        client.disconnect();
      })
      .on('connection', (client: Socket) => {
        this.connectedUsers[client['userId']] = client;
        this.logger.log(`userId: ${client['userId']}`, 'Socket Connected');

        client.on('disconnect', () => {
          delete this.connectedUsers[client['userId']];
          this.logger.log(`userId: ${client['userId']}`, 'Socket Disconnected');
        });
      });
  }

  @UsePipes(new WsNewMessagePipe())
  @UseFilters(new WsExceptionFilter())
  @SubscribeMessage('new_message')
  async handleNewMessage(
    @MessageBody() data: object,
    @ConnectedSocket() client: Socket,
  ): Promise<WsResponse<object>> {
    await this.chatService.createNewMessage({
      from: client['userId'],
      to: data['to'],
      message: data['message'],
      room: data['room'],
    });

    if (data['room']) {
      this.server.to(data['room']).emit('new_message', data['message']);
      return { event: 'new_message', data };
    }

    const to = this.connectedUsers[data['to']];
    if (to) {
      to.emit('new_message', data['message']);
    }
    return { event: 'new_message', data };
  }

  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: object,
  ) {
    console.log('------join_room-------', data['room']);
    if (data['room']) {
      client.join(data['room']);
      client.emit('joined_room', data['room']);
    }
  }

  @SubscribeMessage('leave_room')
  async handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: object,
  ) {
    console.log('------left_room-------', data['room']);
    if (data['room']) {
      client.leave(data['room']);
      client.emit('left_room', data['room']);
    }
  }
}

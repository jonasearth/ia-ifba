import {
  WebSocketGateway,
  OnGatewayConnection,
  WebSocketServer,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { NeuralNetworkSocketService } from './neural-network.socket.service';
import { TrainNeuralNetworkInput } from './dto/neural-network.socket.dto';
import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { ServerExceptionFilter } from 'src/utils/filters/exception.filter';

@UseFilters(ServerExceptionFilter)
@WebSocketGateway()
export class NeuralNetworkSocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private server: Socket;

  constructor(private readonly socketService: NeuralNetworkSocketService) {}

  private connectedClients: Set<Socket> = new Set();
  async handleConnection(socket: Socket): Promise<void> {
    this.connectedClients.add(socket);
    console.log(`Client connected: ${socket.id}`);
  }

  afterInit() {
    console.log('WebSocket Gateway initialized');
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.connectedClients.delete(client);
  }

  @SubscribeMessage('train')
  @UsePipes(new ValidationPipe())
  async handleMessage(
    client: Socket,
    payload: TrainNeuralNetworkInput,
  ): Promise<void> {
    console.log(`Message from client ${client.id}: ${payload}`);
    await this.socketService.train(client, payload);
  }
}

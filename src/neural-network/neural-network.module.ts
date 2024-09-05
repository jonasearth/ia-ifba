import { Module } from '@nestjs/common';
import { NeuralNetworkService } from './neural-network.service';
import { NeuralNetworkController } from './neural-network.controller';
import { NeuralNetworkRepository } from './neural-network.repository';
import { NeuralNetworkEntity } from './entities/neural-network.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NeuralNetworkSocketService } from './socket/neural-network.socket.service';
import { NeuralNetworkSocketGateway } from './socket/neural-network.socket.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([NeuralNetworkEntity], 'reader'),
    TypeOrmModule.forFeature([NeuralNetworkEntity], 'writer'),
  ],
  providers: [
    NeuralNetworkService,
    NeuralNetworkRepository,
    NeuralNetworkSocketGateway,
    NeuralNetworkSocketService,
  ],
  controllers: [NeuralNetworkController],
})
export class NeuralNetworkModule {}

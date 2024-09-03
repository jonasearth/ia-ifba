import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { NeuralNetworkService } from '../neural-network.service';
import { TrainNeuralNetworkInput } from './dto/neural-network.socket.dto';
import { WsException } from '@nestjs/websockets';
import { LearningTypeEnum, NeuralNetworkData } from '../dto/neural-network.dto';

@Injectable()
export class NeuralNetworkSocketService {
  constructor(private readonly neuralNetworkService: NeuralNetworkService) {}

  async train(client: Socket, payload: TrainNeuralNetworkInput): Promise<void> {
    const neuralNetwork = await this.neuralNetworkService.findById(
      payload.neuralNetworkId,
    );
    if (!neuralNetwork) {
      throw new WsException('Neural network not found!');
    }
    this.learningTypeValidation(
      neuralNetwork.learningType,
      payload,
      neuralNetwork.data,
    );
    await this.neuralNetworkService.startTrain(neuralNetwork, payload, client);
  }

  async findAll(): Promise<any> {
    return await this.neuralNetworkService.findAll();
  }

  learningTypeValidation(
    learningType: string,
    payload: TrainNeuralNetworkInput,
    neuralNetwork: NeuralNetworkData,
  ): void {
    if (neuralNetwork.inputLayer.neurons.length !== payload.input[0].length) {
      throw new WsException('Invalid input size!');
    }
    if (payload.input.length !== payload.target.length) {
      throw new WsException('Invalid target size!');
    }
    if (learningType === LearningTypeEnum.GENETIC_ALGORITHM) {
      if (!payload.errorStagnationThreshold) {
        throw new WsException('Error stagnation threshold is required!');
      }
      if (!payload.numNetworks) {
        throw new WsException('Number of networks is required!');
      }
      if (!payload.mutateFactor) {
        throw new WsException('Mutate factor is required!');
      }
      if (!payload.errorThreshold) {
        throw new WsException('Error threshold is required!');
      }
    }
  }
}

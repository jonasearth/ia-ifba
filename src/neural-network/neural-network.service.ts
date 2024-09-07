import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NeuralNetwork } from './implementation/neural-network';
import {
  CreateNeuralNetworkInput,
  LearningTypeEnum,
  NeuralNetworkData,
  NeuralNetworkStatusEnum,
} from './dto/neural-network.dto';
import { NeuralNetworkRepository } from './neural-network.repository';
import { NeuralNetworkEntity } from './entities/neural-network.entity';
import { TrainNeuralNetworkInput } from './socket/dto/neural-network.socket.dto';
import { Socket } from 'socket.io';

@Injectable()
export class NeuralNetworkService {
  private HIDDEN_LAYER_SIZE = 1;
  private OUTPUT_SIZE = 1;
  constructor(
    private readonly neuralNetworkRepository: NeuralNetworkRepository,
  ) {}

  async predict(
    input: number[][],
    neuralNetworkId: string,
    client?: Socket,
  ): Promise<number[][]> {
    const neuralNetwork =
      await this.neuralNetworkRepository.findById(neuralNetworkId);
    if (!neuralNetwork) {
      throw new NotFoundException('Neural network not found!');
    }
    const neuralNetworkModel = NeuralNetwork.fromObject(neuralNetwork.data);
    const data = neuralNetworkModel.predict(input);
    if (client) {
      client.emit('neural-network-predict', {
        id: neuralNetwork.id,
        data,
        status: 'done',
      });
    }
    return data;
  }
  async train(payload: TrainNeuralNetworkInput) {
    const neuralNetwork = await this.neuralNetworkRepository.findById(
      payload.neuralNetworkId,
    );
    if (!neuralNetwork) {
      throw new NotFoundException('Neural network not found!');
    }
    if (neuralNetwork.status === NeuralNetworkStatusEnum.TRAINING) {
      throw new BadRequestException('Neural network is already training!');
    }
    const findRunning = await this.neuralNetworkRepository.findBy({
      status: NeuralNetworkStatusEnum.TRAINING,
    });
    if (findRunning.length >= 4) {
      throw new BadRequestException('Too many trainings running!');
    }
    this.learningTypeValidation(
      neuralNetwork.learningType,
      payload,
      neuralNetwork.data,
    );
    return await this.startTrain(neuralNetwork, payload);
  }
  private learningTypeValidation(
    learningType: string,
    payload: TrainNeuralNetworkInput,
    neuralNetwork: NeuralNetworkData,
  ): void {
    if (neuralNetwork.inputLayer.neurons.length !== payload.input[0].length) {
      throw new BadRequestException('Invalid input size!');
    }
    if (payload.input.length !== payload.target.length) {
      throw new BadRequestException('Invalid target size!');
    }
    if (learningType === LearningTypeEnum.GENETIC_ALGORITHM) {
      if (!payload.errorStagnationThreshold) {
        throw new BadRequestException(
          'Error stagnation threshold is required!',
        );
      }
      if (!payload.numNetworks) {
        throw new BadRequestException('Number of networks is required!');
      }
      if (!payload.mutateFactor) {
        throw new BadRequestException('Mutate factor is required!');
      }
      if (!payload.errorThreshold) {
        throw new BadRequestException('Error threshold is required!');
      }
    }
  }
  async startTrain(
    neuralNetwork: NeuralNetworkEntity,
    payload: TrainNeuralNetworkInput,
    client?: Socket,
  ) {
    switch (neuralNetwork.learningType) {
      case LearningTypeEnum.BACK_PROPAGATION:
        return await this.trainBackPropagation(neuralNetwork, payload, client);
      case LearningTypeEnum.GENETIC_ALGORITHM:
        return await this.trainGeneticAlgorithm(neuralNetwork, payload, client);
      default:
        throw new Error('Invalid learning type!');
    }
  }

  async trainBackPropagation(
    neuralNetwork: NeuralNetworkEntity,
    payload: TrainNeuralNetworkInput,
    client?: Socket,
  ) {
    await this.neuralNetworkRepository.update({
      ...neuralNetwork,
      status: NeuralNetworkStatusEnum.TRAINING,
    });
    console.time('treinamento');
    const neuralNetworkModel = NeuralNetwork.fromObject(neuralNetwork.data);

    for (let i = 0; i < (client ? payload.maxInterations : 1); i++) {
      console.time('treinamento' + i);
      const data = neuralNetworkModel.train(
        payload.input,
        payload.target,
        client ? 1 : payload.maxInterations,
      );
      console.timeEnd('treinamento' + i);

      if (client) {
        if (i % 10 === 0) {
          client.emit('neural-network', {
            id: neuralNetwork.id,
            data: neuralNetworkModel.toObject(),
            status: 'learning',
            input: payload.input,
            response: data.response,
            error: data.err,
          });
        }
      }
    }

    console.timeEnd('treinamento');
    neuralNetwork.data = neuralNetworkModel.toObject();
    neuralNetwork.status = NeuralNetworkStatusEnum.TRAINED;
    await this.neuralNetworkRepository.update(neuralNetwork);
    const response = {
      id: neuralNetwork.id,
      data: neuralNetworkModel.toObject(),
      finalResponse: {
        input: payload.input,
        expected: payload.target,
        predicted: neuralNetworkModel.feedforward(payload.input),
      },
      status: 'done',
    };
    if (client) {
      client.emit('neural-network-done', response);
    }
    return response;
  }

  async trainGeneticAlgorithm(
    neuralNetwork: NeuralNetworkEntity,
    payload: TrainNeuralNetworkInput,
    client?: Socket,
  ) {
    throw new Error('Not implemented yet');
    // console.log('Training with genetic algorithm');
    // const numNetworks = 100;
    // const maxIterations = 100000;
    // const mutateFactor = 0.01;
    // const errorThreshold = 0.01;
    // const errorStagnationThreshold = 10;
    // let lastError = Infinity;
    // let lastErrorCount = 0;
    // let lastBestNeuralNetwork: NeuralNetwork;
    // let bestNeuralNetwork: NeuralNetwork;

    // const neuralNetworks: NeuralNetwork[] = [];
    // const responses: number[][] = [];

    // for (let j = 0; j < numNetworks; j++) {
    //   const currentNeuralNetwork = new NeuralNetwork(
    //     neuralNetwork.data.activationFunction,
    //     payload.input[0].length,
    //     neuralNetwork.data.hiddenLayers[0].neurons.length,
    //     1,
    //     1,
    //   );
    //   neuralNetworks.push(currentNeuralNetwork);
    //   responses.push(
    //     payload.input.map(
    //       (entrada) => currentNeuralNetwork.feedforward2(entrada)[0],
    //     ),
    //   );
    // }

    // for (let i = 0; i < maxIterations; i++) {
    //   const errors = responses.map((response, i) => {
    //     const diffs = response.map((value, j) =>
    //       Math.abs(value - Math.abs(payload.target[j])),
    //     );
    //     const error = Math.max(...diffs);
    //     const soma = diffs.reduce((acc, curr) => acc + curr, 0);
    //     return { error: error > 0.8 ? Infinity : soma, i };
    //   });

    //   const best = errors.reduce((prev, curr) =>
    //     curr.error < prev.error ? curr : prev,
    //   );

    //   if (best.error === lastError) {
    //     lastErrorCount++;
    //   } else {
    //     lastErrorCount = 0;
    //     lastError = best.error;
    //   }

    //   bestNeuralNetwork = neuralNetworks[best.i];

    //   if (best.error < errorThreshold) {
    //     lastBestNeuralNetwork = bestNeuralNetwork;
    //     neuralNetwork.data = bestNeuralNetwork.toObject();
    //     await this.neuralNetworkRepository.update(neuralNetwork);
    //     console.log('Best neural network found');
    //     payload.input.forEach((entrada) =>
    //       console.log(
    //         lastBestNeuralNetwork.feedforward2(entrada)[0].toFixed(20),
    //       ),
    //     );
    //     client.emit('neural-network-done', {
    //       id: neuralNetwork.id,
    //       data: bestNeuralNetwork.toObject(),
    //       status: 'learning',
    //       finalResponse: payload.input.map((input, i) => {
    //         return {
    //           input,
    //           expected: payload.target[i],
    //           predicted: bestNeuralNetwork.feedforward2(input),
    //         };
    //       }),
    //     });
    //     return;
    //   }

    //   neuralNetworks.length = 0;
    //   responses.length = 0;

    //   if (lastErrorCount < errorStagnationThreshold) {
    //     neuralNetworks.push(bestNeuralNetwork);
    //     responses.push(
    //       payload.input.map(
    //         (entrada) => bestNeuralNetwork.feedforward2(entrada)[0],
    //       ),
    //     );
    //   } else {
    //     const newNetwork = new NeuralNetwork(
    //       neuralNetwork.data.activationFunction,
    //       payload.input[0].length,
    //       neuralNetwork.data.hiddenLayers[0].neurons.length,
    //       1,
    //       1,
    //     );
    //     neuralNetworks.push(newNetwork);
    //     responses.push(
    //       payload.input.map((entrada) => newNetwork.feedforward2(entrada)[0]),
    //     );
    //   }

    //   for (let j = 1; j < numNetworks; j++) {
    //     let newNeuralNetwork: NeuralNetwork;

    //     if (
    //       j <= numNetworks * 0.8 &&
    //       lastErrorCount < errorStagnationThreshold
    //     ) {
    //       newNeuralNetwork = bestNeuralNetwork.clone();
    //       newNeuralNetwork.mutate(mutateFactor);
    //     } else {
    //       newNeuralNetwork = new NeuralNetwork(
    //         neuralNetwork.data.activationFunction,
    //         payload.input[0].length,
    //         neuralNetwork.data.hiddenLayers[0].neurons.length,
    //         1,
    //         1,
    //       );
    //     }

    //     neuralNetworks.push(newNeuralNetwork);
    //     const response = payload.input.map((entrada) => {
    //       return newNeuralNetwork.feedforward2(entrada)[0];
    //     });
    //     if (client) {
    //       await new Promise((r) => setTimeout(r, 1));
    //       client.emit('neural-network', {
    //         id: neuralNetwork.id,
    //         data: bestNeuralNetwork.toObject(),
    //         status: 'learning',
    //         input: payload.input,
    //         response,
    //         expected: payload.target,
    //       });
    //     }
    //     responses.push(response);
    //   }
    //   if (client) {
    //     client.emit('clear');
    //   }
    //   lastBestNeuralNetwork = bestNeuralNetwork;
    // }

    // console.log('Last Best neural network found');
    // console.log(lastBestNeuralNetwork.outputLayer.getNeurons());
    // return payload.input.map((input, index) => {
    //   return {
    //     predicted: bestNeuralNetwork.feedforward2(input),
    //     expected: payload.target[index],
    //   };
    // });
  }

  async create(
    createNeuralNetworkInput: CreateNeuralNetworkInput,
  ): Promise<NeuralNetworkEntity> {
    const {
      activationFunction,
      hiddenLayerNodeSize,
      inputLayerNeuronLength,
      learningType,
      name,
    } = createNeuralNetworkInput;
    const hasNeuralNetwork = await this.findByName(name);
    if (hasNeuralNetwork) {
      throw new ConflictException('Neural Network already exists!');
    }
    const neuralNetwork = new NeuralNetwork(
      activationFunction,
      inputLayerNeuronLength,
      hiddenLayerNodeSize,
      this.HIDDEN_LAYER_SIZE,
      this.OUTPUT_SIZE,
    );
    return await this.neuralNetworkRepository.create({
      name,
      learningType,
      data: neuralNetwork.toObject(),
      status: NeuralNetworkStatusEnum.PENDING,
    });
  }

  async findByName(name: string) {
    return await this.neuralNetworkRepository.findByName(name);
  }
  async findById(id: string) {
    return await this.neuralNetworkRepository.findById(id);
  }
  async findAll() {
    return await this.neuralNetworkRepository.list();
  }
  async delete(id: string) {
    const neuralNetwork = await this.neuralNetworkRepository.findById(id);
    console.log(neuralNetwork);
    if (!neuralNetwork) {
      throw new NotFoundException('Neural network not found!');
    }
    return await this.neuralNetworkRepository.delete(neuralNetwork.id);
  }
}

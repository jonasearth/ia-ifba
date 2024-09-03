import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';

import { Response } from 'express';
import { NeuralNetworkService } from './neural-network.service';
import {
  CreateNeuralNetworkInput,
  LearningTypeEnum,
  PredictNeuralNetworkInput,
} from './dto/neural-network.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NeuralNetworkEntity } from './entities/neural-network.entity';
import { TrainNeuralNetworkInput } from './socket/dto/neural-network.socket.dto';

@Controller('neural-network')
@ApiTags('neural-network')
export class NeuralNetworkController {
  constructor(private readonly neuralNetworkService: NeuralNetworkService) {}
  @ApiOperation({
    summary: 'Create a new neural network',
  })
  @Get('/view/:id')
  async viewDetails(@Res() res: Response, @Param('id') id: string) {
    const data = await this.neuralNetworkService.findById(id);
    return res.render('neuralNetworkDetails', {
      neuralNetwork: data,
      renderOptionalInputs:
        data.learningType === LearningTypeEnum.GENETIC_ALGORITHM,
    });
  }
  @ApiOperation({
    summary: 'Create a new neural network',
  })
  @Get('/view')
  async view(@Res() res: Response) {
    const data = await this.neuralNetworkService.findAll();
    const neuralNetworks = data.map((item) => {
      return {
        id: item.id,
        name: item.name,
        learningType: item.learningType,
      };
    });
    return res.render('neuralNetworkList', {
      neuralNetworks,
    });
  }

  @Post('')
  @ApiBody({
    description: 'Input data for Create a new neural network',
    type: CreateNeuralNetworkInput,
  })
  @ApiResponse({
    status: 201,
    description: 'The neural network',
    type: NeuralNetworkEntity,
  })
  @ApiOperation({
    summary: 'Create a new neural network',
  })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createNeuralNetworkInput: CreateNeuralNetworkInput,
  ): Promise<NeuralNetworkEntity> {
    return this.neuralNetworkService.create(createNeuralNetworkInput);
  }

  @Post('/train')
  @ApiBody({
    description: 'Input data for train the neural network',
    type: TrainNeuralNetworkInput,
  })
  @ApiResponse({
    status: 200,
    description: 'The trained neural network',
    type: NeuralNetworkEntity,
  })
  @ApiOperation({
    summary: 'Train the neural network',
  })
  @HttpCode(HttpStatus.CREATED)
  async train(@Body() createNeuralNetworkInput: TrainNeuralNetworkInput) {
    return this.neuralNetworkService.train(createNeuralNetworkInput);
  }

  @Post(':id/predict')
  @ApiBody({
    description: 'Input data for predict the neural network',
    type: PredictNeuralNetworkInput,
  })
  @ApiResponse({
    status: 200,
    description: 'The predicted neural network result',
    type: NeuralNetworkEntity,
  })
  @ApiOperation({
    summary: 'Predict a result',
  })
  @HttpCode(HttpStatus.OK)
  async predict(
    @Param('id') neuralNetworkId: string,
    @Body()
    predictData: PredictNeuralNetworkInput,
  ) {
    return this.neuralNetworkService.predict(
      predictData.input,
      neuralNetworkId,
    );
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'The neural network',
    type: NeuralNetworkEntity,
  })
  @ApiOperation({
    summary: 'Get a neural network by id',
  })
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') neuralNetworkId: string) {
    return this.neuralNetworkService.findById(neuralNetworkId);
  }

  @Get('')
  @ApiResponse({
    status: 200,
    description: 'The neural networks',
    type: [NeuralNetworkEntity],
  })
  @ApiOperation({
    summary: 'Get all neural networks',
  })
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return this.neuralNetworkService.findAll();
  }

  @Delete(':id')
  @ApiResponse({
    status: 204,
    description: 'The neural network has been deleted',
  })
  @ApiOperation({
    summary: 'Delete a neural network by id',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') neuralNetworkId: string) {
    return this.neuralNetworkService.delete(neuralNetworkId);
  }
}

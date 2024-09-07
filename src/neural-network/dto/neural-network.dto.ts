import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsString,
  MinLength,
  MaxLength,
  IsNumber,
  Min,
  IsArray,
  Max,
} from 'class-validator';
import {
  ActivationFunctionEnum,
  LayerType,
} from '../implementation/neural-network';

export enum LearningTypeEnum {
  BACK_PROPAGATION = 'BACK_PROPAGATION',
  GENETIC_ALGORITHM = 'GENETIC_ALGORITHM',
}

export type NeuralNetworkData = {
  activationFunction: string;
  inputLayer: LayerData;
  hiddenLayers: LayerData[];
  outputLayer: LayerData;
};
export type LayerData = {
  type: LayerType;
  neurons: NeuronData[];
  errors: number[];
};

export type NeuronData = {
  weights: number[];
  value: number;
  bias: number;
  delta?: number;
};

export class CreateNeuralNetworkInput {
  @ApiProperty({
    enum: [LearningTypeEnum.BACK_PROPAGATION],
    example: 'BACK_PROPAGATION',
  })
  @IsEnum(LearningTypeEnum)
  learningType: LearningTypeEnum;

  @ApiProperty({
    enum: ActivationFunctionEnum,
  })
  @IsString()
  @IsEnum(ActivationFunctionEnum)
  activationFunction: ActivationFunctionEnum;

  @ApiProperty({
    example: 10,
  })
  @IsNumber()
  @Max(40)
  @Min(1)
  hiddenLayerNodeSize: number;

  @ApiProperty({
    example: 'Test Neural Network',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @ApiProperty({
    example: 10,
  })
  @IsNumber()
  @Max(10)
  @Min(1)
  inputLayerNeuronLength: number;
}

export class PredictNeuralNetworkInput {
  @ApiProperty({
    type: [[Number]],
    example: [[0], [1]],
  })
  @IsArray({})
  input: number[][];
}

export enum NeuralNetworkStatusEnum {
  PENDING = 'PENDING',
  TRAINING = 'TRAINING',
  TRAINED = 'TRAINED',
}

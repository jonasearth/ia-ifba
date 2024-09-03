import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateBy,
} from 'class-validator';

export class TrainNeuralNetworkInput {
  @IsString()
  @ApiProperty({})
  neuralNetworkId: string;

  @ApiProperty({
    type: [[Number]],
    example: [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ],
  })
  @IsArray()
  @Type(() => Number)
  @ValidateBy({
    name: 'hasSameLength',
    validator: {
      validate: (value: number[][]) => {
        return value?.every((arr) => arr?.length === value[0]?.length);
      },
      defaultMessage: () => {
        return 'All arrays must have the same length';
      },
    },
  })
  @ValidateBy({
    name: 'hasSameOutputLength',
    validator: {
      validate: (value: number[][], args) => {
        const object: TrainNeuralNetworkInput =
          args?.object as TrainNeuralNetworkInput;
        return value?.length === object?.target?.length;
      },
      defaultMessage: () => {
        return 'Input and target must have the same length';
      },
    },
  })
  input: number[][];

  @ApiProperty({
    type: [Number],
    example: [0, 1, 1, 1],
  })
  @IsArray()
  @Type(() => Number)
  @ValidateBy({
    name: 'hasValidValues',
    validator: {
      validate: (value: number[]) => {
        return value?.every((data) => data === 0 || data === 1);
      },
      defaultMessage: () => {
        return 'All values must be 0 or 1';
      },
    },
  })
  target: number[];

  @ApiProperty({})
  @IsNumber()
  @Min(10)
  @IsOptional()
  numNetworks: number;

  @ApiProperty({})
  @IsNumber()
  @Min(1)
  maxInterations: number;

  @ApiProperty({})
  @IsNumber()
  @Min(0.01)
  mutateFactor: number;

  @IsNumber()
  @Min(0.000000001)
  @ApiPropertyOptional({})
  @IsOptional()
  errorThreshold: number;

  @IsInt()
  @Min(5)
  @Max(50)
  @ApiPropertyOptional({})
  @IsOptional()
  errorStagnationThreshold: number;

  @IsBoolean()
  @ApiPropertyOptional({})
  @IsOptional()
  usePreviousData: boolean;
}

import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
  ValidateBy,
} from 'class-validator';

export class CreateSlrModelDto {
  @ApiProperty()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  name: string;

  @ApiProperty({
    example: {
      x: [1, 2, 3],
      y: [2, 3, 4],
    },
  })
  @ValidateBy(
    {
      name: 'hasTwoKeys',
      validator: {
        validate(value: object) {
          return Object.keys(value).length === 2;
        },
      },
    },
    {
      message: 'The data object must have exactly two keys',
    },
  )
  data: {
    [key: string]: number[];
  };
}

export class AddDataToSlrModelDto {
  @ApiProperty({
    example: {
      x: [1, 2, 3],
      y: [2, 3, 4],
    },
  })
  @ValidateBy(
    {
      name: 'hasTwoKeys',
      validator: {
        validate(value: object) {
          return Object.keys(value).length === 2;
        },
      },
    },
    {
      message: 'The data object must have exactly two keys',
    },
  )
  data: {
    [key: string]: number[];
  };
}

export class PredictSlrModelDto {
  @ApiProperty()
  @IsNumber({})
  @Transform(({ value }) => Number(value))
  x: number;
}

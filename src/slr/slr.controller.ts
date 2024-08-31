import { Body, Controller, Get, Param, Post, Query, Res } from '@nestjs/common';

import { Response } from 'express';
import {
  AddDataToSlrModelDto,
  CreateSlrModelDto,
  PredictSlrModelDto,
} from './dto/create-slr-model.dto';
import { SlrService } from './slr.service';
import {
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { SlrModelEntity } from './entities/slr-model.entity';

@ApiTags('Simple Linear Regression')
@Controller('slr')
export class SlrController {
  constructor(private readonly slrService: SlrService) {}

  @ApiOperation({ summary: 'Create a new Simple Linear Regression model' })
  @ApiOkResponse({ type: SlrModelEntity })
  @ApiConflictResponse({ description: 'Model already exists' })
  @ApiUnprocessableEntityResponse({ description: 'Invalid data' })
  @Post()
  public async create(
    @Body() body: CreateSlrModelDto,
  ): Promise<SlrModelEntity> {
    return await this.slrService.create(body);
  }

  @ApiOperation({ summary: 'Get a Simple Linear Regression model' })
  @ApiOkResponse({ type: SlrModelEntity })
  @ApiNotFoundResponse({ description: 'Model not found' })
  @ApiUnprocessableEntityResponse({ description: 'Invalid data' })
  @Get(':slrModelId')
  public async get(
    @Param('slrModelId') slrModelId: string,
  ): Promise<SlrModelEntity> {
    return await this.slrService.get(slrModelId);
  }

  @ApiOperation({ summary: 'Append data to a Simple Linear Regression model' })
  @ApiNotFoundResponse({ description: 'Model not found' })
  @ApiUnprocessableEntityResponse({ description: 'Invalid data' })
  @ApiOkResponse({ type: SlrModelEntity })
  @Post(':slrModelId/data')
  public async appendData(
    @Body() body: AddDataToSlrModelDto,
    @Param('slrModelId') slrModelId: string,
  ): Promise<SlrModelEntity> {
    return await this.slrService.appendData(slrModelId, body);
  }

  @Get(':slrModelId/predict')
  async predict(
    @Param('slrModelId') slrModelId: string,
    @Query() query: PredictSlrModelDto,
  ): Promise<number> {
    return await this.slrService.predict(slrModelId, query.x);
  }

  @ApiOperation({ summary: 'Get a Simple Linear Regression model graph' })
  @Get(':slrModelId/graph')
  async graph(@Param('slrModelId') slrModelId: string, @Res() res: Response) {
    const data = await this.slrService.fullData(slrModelId);
    return res.render('slr', {
      name: data.slrModel.name,
      axilYName: data.slrModel.yKey,
      axilXName: data.slrModel.xKey,
      axilXData: data.slrModelData.x,
      axilYData: data.slrModelData.y,
      angularCoefficient: data.slrModel.angularCoefficient,
      intercept: data.slrModel.intercept,
    });
  }
}

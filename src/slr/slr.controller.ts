import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { Response } from 'express';
import {
  AddDataToSlrModelDto,
  CreateSlrModelDto,
  PredictSlrModelDto,
} from './dto/create-slr-model.dto';
import { SlrService } from './slr.service';
import {
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { SlrModelEntity } from './entities/slr-model.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

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

  @ApiOperation({ summary: 'Append data to a Simple Linear Regression model' })
  @ApiNotFoundResponse({ description: 'Model not found' })
  @ApiUnprocessableEntityResponse({ description: 'Invalid data' })
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({ type: SlrModelEntity })
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @Post(':slrModelId/csv')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { files: 1, fileSize: 1024 * 1024 * 5 }, // 1 MB you can adjust size here
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['text/csv'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
          cb(new BadRequestException('Invalid file type'), false);
        } else if (file?.size > 1024 * 1024 * 5) {
          cb(
            new BadRequestException('Max File Size Reached. Max Allowed: 1MB'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  public async appendDataCsv(
    @UploadedFile() file: Express.Multer.File,
    @Param('slrModelId') slrModelId: string,
  ): Promise<SlrModelEntity> {
    return await this.slrService.appendDataCsv(slrModelId, file);
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

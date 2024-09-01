import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { LinearRegressionOutput } from './dto/slr.dto';
import { SlrModelRepository } from './slr-model.repository';
import {
  AddDataToSlrModelDto,
  CreateSlrModelDto,
} from './dto/create-slr-model.dto';
import { SlrModelDataRepository } from './slr-model-data.repository';
import { SlrModelEntity } from './entities/slr-model.entity';
import { SlrModelDataEntity } from './entities/slr-model-data.entity';
import * as csv from 'csv-parse';

@Injectable()
export class SlrService {
  constructor(
    private readonly slrModelRepository: SlrModelRepository,
    private readonly slrModelDataRepository: SlrModelDataRepository,
  ) {}

  public async get(slrModelId: string): Promise<SlrModelEntity> {
    const slr = await this.slrModelRepository.findById(slrModelId);
    if (!slr) {
      throw new NotFoundException('Model not found');
    }
    return slr;
  }
  public async appendData(
    slrModelId: string,
    body: AddDataToSlrModelDto,
  ): Promise<SlrModelEntity> {
    this.validateData(body.data);
    const slr = await this.slrModelRepository.findById(slrModelId);
    if (!slr) {
      throw new NotFoundException('Model not found');
    }
    if (
      slr.xKey !== Object.keys(body.data)[0] ||
      slr.yKey !== Object.keys(body.data)[1]
    ) {
      throw new UnprocessableEntityException(
        'Data keys do not match model keys',
      );
    }
    const [x, y] = Object.values(body.data);
    const previousData = await this.slrModelDataRepository.find({
      slrModelId,
    });
    const { intercept, angularCoefficient } = this.calculateLinearRegression(
      [...previousData.x, ...x],
      [...previousData.y, ...y],
    );
    const [, model] = await Promise.all([
      this.slrModelDataRepository.appendData(slrModelId, x, y),
      this.slrModelRepository.update(slrModelId, {
        angularCoefficient,
        intercept,
      }),
    ]);
    return model;
  }

  public async appendDataCsv(slrModelId: string, file: Express.Multer.File) {
    const csvData = file.buffer;
    const parsedData: any = await new Promise((resolve, reject) => {
      csv.parse(
        csvData,
        {
          columns: true,
          relax_quotes: true,
          skip_empty_lines: true,
          cast: true,
        },
        async (err, data) => {
          if (err) {
            reject(err);
            return { error: true, message: 'Unable to parse file' };
          }

          resolve({
            [Object.keys(data[0])[0]]: data.map(
              (d) => d[Object.keys(data[0])[0]],
            ),
            [Object.keys(data[0])[1]]: data.map(
              (d) => d[Object.keys(data[0])[1]],
            ),
          });
        },
      );
    });
    return await this.appendData(slrModelId, { data: parsedData });
  }
  public async create(body: CreateSlrModelDto): Promise<SlrModelEntity> {
    this.validateData(body.data);
    const slr = await this.slrModelRepository.findByName(body.name);
    if (slr) {
      throw new ConflictException('Model already exists');
    }
    const [x, y] = Object.values(body.data);
    const [key1, key2] = Object.keys(body.data);
    const { intercept, angularCoefficient } = this.calculateLinearRegression(
      x,
      y,
    );
    const slrModel = await this.slrModelRepository.create({
      name: body.name,
      intercept,
      angularCoefficient,
      xKey: key1,
      yKey: key2,
    });
    await this.slrModelDataRepository.create({
      slrModelId: slrModel.id,
      x,
      y,
    });
    return slrModel;
  }

  private calculateLinearRegression(
    x: number[],
    y: number[],
  ): LinearRegressionOutput {
    const n = x.length;
    const sumX = x.reduce((acc, xi) => acc + xi, 0);
    const sumY = y.reduce((acc, yi) => acc + yi, 0);
    const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0);
    const sumX2 = x.reduce((acc, xi) => acc + xi ** 2, 0);
    const angularCoefficient =
      (n * sumXY - sumX * sumY) / (n * sumX2 - sumX ** 2);
    const intercept = (sumY - angularCoefficient * sumX) / n;
    return { intercept, angularCoefficient };
  }
  public async fullData(
    slrModelId: string,
  ): Promise<{ slrModel: SlrModelEntity; slrModelData: SlrModelDataEntity }> {
    const slr = await this.slrModelRepository.findById(slrModelId);
    if (!slr) {
      throw new NotFoundException('Model not found');
    }
    const slrData = await this.slrModelDataRepository.find({ slrModelId });
    return { slrModel: slr, slrModelData: slrData };
  }

  public async predict(slrModelId: string, x: number): Promise<number> {
    const slr = await this.slrModelRepository.findById(slrModelId);
    if (!slr) {
      throw new NotFoundException('Model not found');
    }
    return this.calculatePredict(x, slr);
  }
  private calculatePredict(
    x: number,
    linearRegressionData: LinearRegressionOutput,
  ): number {
    return (
      linearRegressionData.intercept +
      linearRegressionData.angularCoefficient * x
    );
  }

  private validateData(data: Record<string, number[]>): void {
    if (Object.keys(data).length !== 2 || Object.values(data).length !== 2) {
      throw new UnprocessableEntityException('Data must have two keys');
    }
    const [x, y] = Object.values(data);
    if (x.length !== y.length) {
      throw new UnprocessableEntityException('Data must have the same length');
    }

    if (
      x.some(
        (value) =>
          isNaN(value) || !isFinite(value) || typeof value !== 'number',
      ) ||
      y.some(
        (value) =>
          isNaN(value) || !isFinite(value) || typeof value !== 'number',
      )
    ) {
      throw new UnprocessableEntityException('Data must have only numbers');
    }
  }
}

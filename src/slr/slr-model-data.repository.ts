import { Injectable } from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SlrModelDataEntity } from './entities/slr-model-data.entity';

@Injectable()
export class SlrModelDataRepository {
  constructor(
    @InjectRepository(SlrModelDataEntity, 'reader')
    private readonly slrModelDataRepositoryReader: Repository<SlrModelDataEntity>,
    @InjectRepository(SlrModelDataEntity, 'writer')
    private readonly slrModelDataRepositoryWriter: Repository<SlrModelDataEntity>,
  ) {}

  async list(
    where: FindOptionsWhere<SlrModelDataEntity>,
  ): Promise<SlrModelDataEntity[]> {
    return await this.slrModelDataRepositoryReader.find({
      where,
    });
  }

  async find(
    user: FindOptionsWhere<SlrModelDataEntity>,
  ): Promise<SlrModelDataEntity | null> {
    return await this.slrModelDataRepositoryReader.findOne({ where: user });
  }

  async create(data: Partial<SlrModelDataEntity>): Promise<SlrModelDataEntity> {
    return await this.slrModelDataRepositoryWriter.save(data);
  }

  async update(
    id: string,
    data: Partial<SlrModelDataEntity>,
  ): Promise<SlrModelDataEntity | null> {
    await this.slrModelDataRepositoryWriter.update(id, data);
    return await this.slrModelDataRepositoryReader.findOne({ where: { id } });
  }

  async appendData(id, x, y) {
    await this.slrModelDataRepositoryWriter
      .createQueryBuilder()
      .update(SlrModelDataEntity)
      .set({
        x: () => `array_cat(x, ARRAY[${x}])`,
        y: () => `array_cat(y, ARRAY[${y}])`,
      })
      .where('slr_model_id = :id', { id })
      .execute();
  }

  async delete(id: string): Promise<void> {
    await this.slrModelDataRepositoryReader.softDelete(id);
  }
}

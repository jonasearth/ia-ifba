import { Injectable } from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SlrModelDataEntity } from './entities/slr-model-data.entity';

@Injectable()
export class SlrModelDataRepository {
  constructor(
    @InjectRepository(SlrModelDataEntity)
    private readonly slrModelDataRepository: Repository<SlrModelDataEntity>,
  ) {}

  async list(
    where: FindOptionsWhere<SlrModelDataEntity>,
  ): Promise<SlrModelDataEntity[]> {
    return await this.slrModelDataRepository.find({
      where,
    });
  }

  async find(
    user: FindOptionsWhere<SlrModelDataEntity>,
  ): Promise<SlrModelDataEntity | null> {
    return await this.slrModelDataRepository.findOne({ where: user });
  }

  async create(data: Partial<SlrModelDataEntity>): Promise<SlrModelDataEntity> {
    return await this.slrModelDataRepository.save(data);
  }

  async update(
    id: string,
    data: Partial<SlrModelDataEntity>,
  ): Promise<SlrModelDataEntity | null> {
    await this.slrModelDataRepository.update(id, data);
    return await this.slrModelDataRepository.findOne({ where: { id } });
  }

  async appendData(id, x, y) {
    await this.slrModelDataRepository
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
    await this.slrModelDataRepository.softDelete(id);
  }
}

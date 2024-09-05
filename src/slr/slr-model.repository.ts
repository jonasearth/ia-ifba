import { Injectable } from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SlrModelEntity } from './entities/slr-model.entity';

@Injectable()
export class SlrModelRepository {
  constructor(
    @InjectRepository(SlrModelEntity, 'reader')
    private readonly slrModelRepositoryReader: Repository<SlrModelEntity>,
    @InjectRepository(SlrModelEntity, 'writer')
    private readonly slrModelRepositoryWriter: Repository<SlrModelEntity>,
  ) {}

  async list(
    where: FindOptionsWhere<SlrModelEntity>,
  ): Promise<SlrModelEntity[]> {
    return await this.slrModelRepositoryReader.find({
      where,
    });
  }
  async findById(
    id: string,
    loadRelations = false,
  ): Promise<SlrModelEntity | null> {
    return await this.slrModelRepositoryReader.findOne({
      where: { id },
      relations: loadRelations ? ['user'] : [],
    });
  }
  async findByName(
    name: string,
    loadRelations = false,
  ): Promise<SlrModelEntity | null> {
    return await this.slrModelRepositoryReader.findOne({
      where: { name },
      relations: loadRelations ? ['user'] : [],
    });
  }

  async find(
    user: FindOptionsWhere<SlrModelEntity>,
  ): Promise<SlrModelEntity | null> {
    return await this.slrModelRepositoryReader.findOne({ where: user });
  }

  async create(data: Partial<SlrModelEntity>): Promise<SlrModelEntity> {
    return await this.slrModelRepositoryWriter.save(data);
  }

  async update(
    id: string,
    data: Partial<SlrModelEntity>,
  ): Promise<SlrModelEntity | null> {
    await this.slrModelRepositoryWriter.update(id, data);
    return await this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.slrModelRepositoryWriter.softDelete(id);
  }
}

import { Injectable } from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SlrModelEntity } from './entities/slr-model.entity';

@Injectable()
export class SlrModelRepository {
  constructor(
    @InjectRepository(SlrModelEntity)
    private readonly slrModelRepository: Repository<SlrModelEntity>,
  ) {}

  async list(
    where: FindOptionsWhere<SlrModelEntity>,
  ): Promise<SlrModelEntity[]> {
    return await this.slrModelRepository.find({
      where,
    });
  }
  async findById(
    id: string,
    loadRelations = false,
  ): Promise<SlrModelEntity | null> {
    return await this.slrModelRepository.findOne({
      where: { id },
      relations: loadRelations ? ['user'] : [],
    });
  }
  async findByName(
    name: string,
    loadRelations = false,
  ): Promise<SlrModelEntity | null> {
    return await this.slrModelRepository.findOne({
      where: { name },
      relations: loadRelations ? ['user'] : [],
    });
  }

  async find(
    user: FindOptionsWhere<SlrModelEntity>,
  ): Promise<SlrModelEntity | null> {
    return await this.slrModelRepository.findOne({ where: user });
  }

  async create(data: Partial<SlrModelEntity>): Promise<SlrModelEntity> {
    return await this.slrModelRepository.save(data);
  }

  async update(
    id: string,
    data: Partial<SlrModelEntity>,
  ): Promise<SlrModelEntity | null> {
    await this.slrModelRepository.update(id, data);
    return await this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.slrModelRepository.softDelete(id);
  }
}

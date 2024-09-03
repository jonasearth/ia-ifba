import { InjectRepository } from '@nestjs/typeorm';
import { NeuralNetworkEntity } from './entities/neural-network.entity';
import { Repository } from 'typeorm';

export class NeuralNetworkRepository {
  constructor(
    @InjectRepository(NeuralNetworkEntity)
    private readonly neuralNetworkRepository: Repository<NeuralNetworkEntity>,
  ) {}

  async list(): Promise<NeuralNetworkEntity[]> {
    return await this.neuralNetworkRepository.find();
  }

  async findById(id: string): Promise<NeuralNetworkEntity | null> {
    return await this.neuralNetworkRepository.findOneBy({ id });
  }

  async findByName(name: string): Promise<NeuralNetworkEntity | null> {
    return await this.neuralNetworkRepository.findOneBy({ name });
  }

  async create(
    data: Partial<NeuralNetworkEntity>,
  ): Promise<NeuralNetworkEntity> {
    return await this.neuralNetworkRepository.save(data);
  }

  async update(
    neuralNetwork: NeuralNetworkEntity,
  ): Promise<NeuralNetworkEntity> {
    return await this.neuralNetworkRepository.save(neuralNetwork);
  }

  async delete(id: string): Promise<void> {
    await this.neuralNetworkRepository.softDelete(id);
  }
}

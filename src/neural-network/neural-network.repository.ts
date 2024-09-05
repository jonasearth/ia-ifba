import { InjectRepository } from '@nestjs/typeorm';
import { NeuralNetworkEntity } from './entities/neural-network.entity';
import { Repository } from 'typeorm';

export class NeuralNetworkRepository {
  constructor(
    @InjectRepository(NeuralNetworkEntity, 'reader')
    private readonly neuralNetworkRepositoryReader: Repository<NeuralNetworkEntity>,
    @InjectRepository(NeuralNetworkEntity, 'writer')
    private readonly neuralNetworkRepositoryWriter: Repository<NeuralNetworkEntity>,
  ) {}

  async list(): Promise<NeuralNetworkEntity[]> {
    return await this.neuralNetworkRepositoryReader.find();
  }

  async findById(id: string): Promise<NeuralNetworkEntity | null> {
    return await this.neuralNetworkRepositoryReader.findOneBy({ id });
  }

  async findByName(name: string): Promise<NeuralNetworkEntity | null> {
    return await this.neuralNetworkRepositoryReader.findOneBy({ name });
  }

  async create(
    data: Partial<NeuralNetworkEntity>,
  ): Promise<NeuralNetworkEntity> {
    return await this.neuralNetworkRepositoryWriter.save(data);
  }

  async update(neuralNetwork: NeuralNetworkEntity): Promise<void> {
    const { id, ...remain } = neuralNetwork;
    await this.neuralNetworkRepositoryWriter.update(id, remain);
  }

  async delete(id: string): Promise<void> {
    await this.neuralNetworkRepositoryWriter.softDelete(id);
  }
}

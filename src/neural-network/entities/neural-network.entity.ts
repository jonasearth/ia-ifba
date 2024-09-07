import { ApiResponseProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  LearningTypeEnum,
  NeuralNetworkData,
  NeuralNetworkStatusEnum,
} from '../dto/neural-network.dto';

@Entity('neural_networks')
export class NeuralNetworkEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiResponseProperty()
  id: string;

  @ApiResponseProperty()
  @Index('neural-network-name-idx', {
    unique: true,
    where: '"deleted_at" IS NULL',
  })
  @Column({ nullable: false })
  name: string;

  @ApiResponseProperty()
  @Column({
    enum: LearningTypeEnum,
    nullable: false,
    name: 'learning_type',
  })
  learningType: LearningTypeEnum;

  @ApiResponseProperty()
  @Column({
    nullable: false,
    type: 'jsonb',
  })
  data: NeuralNetworkData;

  @ApiResponseProperty()
  @Column({
    enum: NeuralNetworkStatusEnum,
    nullable: false,
    default: 'PENDING',
  })
  status: NeuralNetworkStatusEnum;

  @ApiResponseProperty()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiResponseProperty()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ApiResponseProperty()
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date | null;
}

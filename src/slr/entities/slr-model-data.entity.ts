import { ApiResponseProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SlrModelEntity } from './slr-model.entity';

@Entity('slr-model-data')
export class SlrModelDataEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiResponseProperty()
  id: string;

  @ApiResponseProperty()
  @Column({ type: 'numeric', nullable: false, array: true })
  x: number[];

  @ApiResponseProperty()
  @Column({ type: 'numeric', nullable: false, array: true })
  y: number[];

  @ApiResponseProperty()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiResponseProperty()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ApiResponseProperty()
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date | null;

  @ManyToOne(() => SlrModelEntity, (slrModel) => slrModel.slrModelData, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'slr_model_id', referencedColumnName: 'id' })
  slrModel: SlrModelEntity;

  @Index('slr-model-data-slr-model-id-relation-idx', {
    unique: true,
    where: '"deleted_at" IS NULL',
  })
  @Column({ type: 'uuid', name: 'slr_model_id', nullable: false, unique: true })
  slrModelId: string;
}

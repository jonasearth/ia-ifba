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

@Entity('slr-model')
export class SlrModelEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiResponseProperty()
  id: string;

  @ApiResponseProperty()
  @Index('slr-model-name-idx', { unique: true, where: '"deleted_at" IS NULL' })
  @Column({ nullable: false })
  name: string;

  @ApiResponseProperty()
  @Column({ nullable: false })
  intercept: number;

  @ApiResponseProperty()
  @Column({ nullable: false, name: 'angular_coefficient' })
  angularCoefficient: number;

  @ApiResponseProperty()
  @Column({ type: 'jsonb', nullable: false })
  data: Record<string, any>;

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

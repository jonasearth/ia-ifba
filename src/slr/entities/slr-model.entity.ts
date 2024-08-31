import { ApiResponseProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SlrModelDataEntity } from './slr-model-data.entity';

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
  @Column({ nullable: false, name: 'x_key' })
  xKey: string;

  @ApiResponseProperty()
  @Column({ nullable: false, name: 'y_key' })
  yKey: string;

  @ApiResponseProperty()
  @Column({ nullable: false, type: 'double precision' })
  intercept: number;

  @ApiResponseProperty()
  @Column({
    nullable: false,
    name: 'angular_coefficient',
    type: 'double precision',
  })
  angularCoefficient: number;

  @ApiResponseProperty()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiResponseProperty()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ApiResponseProperty()
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date | null;

  @OneToOne(() => SlrModelDataEntity, (slrModelData) => slrModelData.slrModel)
  slrModelData: SlrModelDataEntity[];
}

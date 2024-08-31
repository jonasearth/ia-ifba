import { Module } from '@nestjs/common';
import { SlrController } from './slr.controller';
import { SlrService } from './slr.service';
import { SlrModelRepository } from './slr-model.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SlrModelEntity } from './entities/slr-model.entity';
import { SlrModelDataRepository } from './slr-model-data.repository';
import { SlrModelDataEntity } from './entities/slr-model-data.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SlrModelEntity, SlrModelDataEntity])],
  controllers: [SlrController],
  providers: [SlrService, SlrModelRepository, SlrModelDataRepository],
})
export class SlrModule {}

import { Module } from '@nestjs/common';
import { SlrController } from './slr.controller';
import { SlrService } from './slr.service';

@Module({
  controllers: [SlrController],
  providers: [SlrService],
})
export class SlrModule {}

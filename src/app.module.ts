import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { SlrModule } from './slr/slr.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigService } from './app.env.service';
import { migrations } from './libs/database/migrations';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SlrModule,
    TypeOrmModule.forRootAsync({
      name: 'reader',
      imports: [AppModule],
      useFactory: (appEnvService: AppConfigService) => ({
        name: 'reader',
        type: appEnvService.database.type as any,
        host: appEnvService.database.hostRead,
        port: appEnvService.database.port,
        username: appEnvService.database.username,
        password: appEnvService.database.password,
        database: appEnvService.database.database,
        autoLoadEntities: true,
        migrations,
      }),
      inject: [AppConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppModule {}

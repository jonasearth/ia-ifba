import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { SlrModule } from './slr/slr.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigService } from './app.env.service';
import { migrations } from './libs/database/migrations';
import { ConfigModule } from '@nestjs/config';
import { NeuralNetworkModule } from './neural-network/neural-network.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SlrModule,
    TypeOrmModule.forRootAsync({
      imports: [AppModule],
      useFactory: (appEnvService: AppConfigService) => ({
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
    NeuralNetworkModule,
  ],
  controllers: [AppController],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppModule {}

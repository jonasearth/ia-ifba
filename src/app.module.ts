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
        schema: appEnvService.database.schema,
        autoLoadEntities: true,
        migrations,
      }),
      inject: [AppConfigService],
    }),
    TypeOrmModule.forRootAsync({
      name: 'writer',
      imports: [AppModule],
      useFactory: (appEnvService: AppConfigService) => ({
        name: 'writer',
        type: appEnvService.database.type as any,
        host: appEnvService.database.hostWrite,
        port: appEnvService.database.port,
        username: appEnvService.database.username,
        password: appEnvService.database.password,
        database: appEnvService.database.database,
        schema: appEnvService.database.schema,
        autoLoadEntities: true,
        migrations,
        migrationsRun: true,
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

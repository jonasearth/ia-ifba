import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface IDatabaseConfig {
  type: string;
  hostRead: string;
  hostWrite: string;
  port: number;
  schema: string;
  username: string;
  password: string;
  database: string;
  autoLoadEntities: boolean;
}
@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  //database envs
  get database(): IDatabaseConfig {
    return {
      type: this.configService.get('DB_TYPE') || 'postgres',
      hostRead: this.configService.get('DB_HOST_READ') || '',
      hostWrite: this.configService.get('DB_HOST_WRITE') || '',
      port: this.configService.get('DB_INTERNAL_PORT') || 5432,
      username: this.configService.get('DB_USER') || '',
      password: this.configService.get('DB_PASSWORD') || '',
      database: this.configService.get('DB_NAME') || '',
      schema: this.configService.get('DB_SCHEMA') || 'public',
      autoLoadEntities: true,
    };
  }
}

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvironmentService {
  constructor(private configService: ConfigService) {}

  get port(): number {
    return this.configService.get<number>('PORT');
  }

  get postgresHost(): string {
    return this.configService.get<string>('POSTGRES_HOST');
  }

  get postgresPort(): number {
    return this.configService.get<number>('POSTGRES_PORT');
  }

  get postgresDb(): string {
    return this.configService.get<string>('POSTGRES_DB');
  }

  get postgresUser(): string {
    return this.configService.get<string>('POSTGRES_USER');
  }

  get postgresPassword(): string {
    return this.configService.get<string>('POSTGRES_PASSWORD');
  }

  get secret(): string {
    return this.configService.get<string>('SECRET');
  }

  get expiredIn(): string {
    return this.configService.get<string>('EXPIRED_IN');
  }

  get redisBlacklistHost(): string {
    return this.configService.get<string>('REDIS_BLACKLIST_HOST');
  }

  get redisBlacklistPort(): number {
    return this.configService.get<number>('REDIS_BLACKLIST_PORT');
  }
}

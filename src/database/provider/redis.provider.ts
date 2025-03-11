import { Provider } from '@nestjs/common';
import Redis from 'ioredis';
import { EnvironmentService } from 'src/environment/environment.service';

export const RedisProvider: Provider = {
  provide: 'REDIS_CLIENT',
  inject: [EnvironmentService],
  useFactory: (environmentService: EnvironmentService) => {
    return new Redis({
      host: environmentService.redisBlacklistHost,
      port: environmentService.redisBlacklistPort,
    });
  },
};

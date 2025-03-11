import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisProvider } from 'src/database/provider/redis.provider';
import { RedisService } from 'src/database/redis.service';
import { EnvironmentModule } from 'src/environment/environment.module';
import { EnvironmentService } from 'src/environment/environment.service';

@Module({
  imports: [
    EnvironmentModule,
    TypeOrmModule.forRootAsync({
      inject: [EnvironmentService],
      imports: [EnvironmentModule],
      useFactory: ({
        postgresHost,
        postgresPort,
        postgresUser,
        postgresPassword,
        postgresDb,
      }: EnvironmentService) => ({
        type: 'postgres',
        host: postgresHost,
        port: postgresPort,
        username: postgresUser,
        password: postgresPassword,
        database: postgresDb,
        autoLoadEntities: true,
        entities: [__dirname + '/../models/*.model.{ts,js}'],
        synchronize: true,
      }),
    }),
  ],
  providers: [RedisProvider, RedisService],
  exports: [RedisService],
})
export class DatabaseModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvironmentModule } from 'src/environment/environment.module';
import { EnvironmentService } from 'src/environment/environment.service';

@Module({
  imports: [
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
        entities: [__dirname + '/../**/*.entity.{ts,js}'],
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}

import { plainToInstance } from 'class-transformer';
import { IsNumber, IsString, Min, validateSync } from 'class-validator';

export class EnvironmentVariablesDto {
  @IsNumber()
  PORT: number;

  @IsString()
  POSTGRES_HOST: string;

  @IsNumber()
  @Min(1)
  POSTGRES_PORT: number;

  @IsString()
  POSTGRES_DB: string;

  @IsString()
  POSTGRES_USER: string;

  @IsString()
  POSTGRES_PASSWORD: string;

  @IsString()
  SECRET: string;

  @IsString()
  EXPIRED_IN: string;
}

export function validate(
  config: Record<string, string | number>,
): EnvironmentVariablesDto {
  const variables = plainToInstance(EnvironmentVariablesDto, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(variables);
  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return variables;
}

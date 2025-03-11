import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T> {
  @ApiProperty({ description: 'Response data', name: 'data' })
  data: T;

  @ApiProperty({
    description: 'Timestamp of the response',
    example: '2025-03-11T12:00:00Z',
    name: 'timestamp',
  })
  timestamp: string;

  @ApiProperty({
    description: 'API path',
    name: 'path',
  })
  path: string;
}

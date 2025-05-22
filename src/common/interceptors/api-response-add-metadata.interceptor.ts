import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { isArray } from 'class-validator';
import { Response } from 'express';
import { map, Observable } from 'rxjs';

const addMetadata = ({ data, context }: any) => {
  const response: Response = context.switchToHttp().getResponse();
  const statusCode = response.statusCode;
  const metadata: Record<string, any> = {};
  metadata['statusCode'] = statusCode;
  metadata['data'] = data;
  metadata['timestamp'] = new Date().toISOString();
  metadata['path'] = context.switchToHttp().getRequest().path;

  if (isArray(data)) {
    metadata['count'] = data.length;
  }
  return metadata;
};

@Injectable()
export class ApiResponseAddMetadataInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next
      .handle()
      .pipe(map((data: any) => addMetadata({ data, context })));
  }
}

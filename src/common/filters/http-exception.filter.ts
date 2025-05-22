import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { isArray } from 'class-validator';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const request: Request = context.getRequest();
    const response: Response = context.getResponse();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as Record<string, any>;
    const details = exceptionResponse.message;
    const message: string = isArray(details) ? details[0] : details;

    response.status(status).json({
      status_code: status,
      status: exceptionResponse.error,
      message,
      ...(isArray(details) &&
        details.length > 1 && {
          details,
        }),
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { Contestant } from 'src/models/contestant.model';
import { AuthPayload } from 'src/modules/auth/dto/jwt-claim.dto';

export const RequestedUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    return request?.user;
  },
);

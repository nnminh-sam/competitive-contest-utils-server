import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { JwtClaimDto } from 'src/modules/auth/dto/jwt-claim.dto';

export const UserClaim = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    return request?.user as JwtClaimDto;
  },
);

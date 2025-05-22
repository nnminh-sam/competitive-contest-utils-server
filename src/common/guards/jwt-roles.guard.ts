import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { RoleEnum } from 'src/models/enums/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { AuthPayload } from 'src/modules/auth/dto/jwt-claim.dto';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class JwtRolesGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // First, check JWT authentication
    const jwtResult = super.canActivate(context);

    const handleJwtResult = (isValid: boolean) => {
      if (!isValid) {
        return false;
      }

      // After JWT is valid, check roles
      const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );

      if (!requiredRoles) {
        return true;
      }

      const request = context.switchToHttp().getRequest<Request>();
      const user = request.user as AuthPayload;
      console.log('🚀 ~ JwtRolesGuard ~ handleJwtResult ~ user:', user);

      if (!user) {
        throw new UnauthorizedException('User not found in request');
      }

      return requiredRoles.some((role) => user.role === role);
    };

    if (jwtResult instanceof Promise) {
      return jwtResult.then(handleJwtResult);
    }

    if (jwtResult instanceof Observable) {
      return jwtResult.pipe(map(handleJwtResult));
    }

    return handleJwtResult(jwtResult);
  }
}

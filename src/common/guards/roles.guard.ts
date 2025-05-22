import { Reflector } from '@nestjs/core';
import { RoleEnum } from 'src/models/enums/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { AuthPayload } from 'src/modules/auth/dto/jwt-claim.dto';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as AuthPayload;
    console.log('🚀 ~ RolesGuard ~ canActivate ~ user:', user);
    // return true;

    if (!user) {
      throw new UnauthorizedException('User not found in request');
    }

    return requiredRoles.some((role) => user.role === role);
  }
}

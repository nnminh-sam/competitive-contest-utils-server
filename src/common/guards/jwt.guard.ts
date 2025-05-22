import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log(
      '=================================================Called jwt guard',
    );
    const request = context.switchToHttp().getRequest<Request>();
    const result = super.canActivate(context);
    console.log(
      '🚀 ~ JwtGuard ~ classJwtGuardextendsAuthGuard ~ result:',
      result,
    );

    if (result instanceof Promise) {
      return result.then((isValid) => {
        if (isValid) {
          // Ensure user is attached to request
          request.user = request.user || {};
        }
        return isValid;
      });
    }

    if (result instanceof Observable) {
      return result.pipe(
        map((isValid) => {
          if (isValid) {
            // Ensure user is attached to request
            request.user = request.user || {};
          }
          return isValid;
        }),
      );
    }

    return result;
  }
}

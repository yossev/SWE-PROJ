/* eslint-disable prettier/prettier */
import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | any {
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
    const request = context.switchToHttp().getRequest();
    console.log(`Is Public Route: ${isPublic}, URL: ${request.url}`);
    if (isPublic) {
      return true; // Skip authentication
    }
    return super.canActivate(context); // Otherwise, apply authentication
  }
}

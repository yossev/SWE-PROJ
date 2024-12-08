import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { AuthGuard as Auth } from '@nestjs/passport';

@Injectable()
export class AuthGuard extends Auth('jwt') implements CanActivate {
  constructor(private jwtService: JwtService, @Inject(Reflector) private reflector: Reflector) {
    super();
    console.log('Reflector in constructor:', this.reflector);
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log("Public key",this.reflector);
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('No token, please login');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    return request.cookies?.Token || request.headers['authorization']?.split(' ')[1];
  }
}

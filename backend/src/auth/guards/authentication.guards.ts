import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { AuthGuard as Auth } from '@nestjs/passport';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthGuard extends Auth('jwt') implements CanActivate {
  constructor(private jwtService: JwtService, @Inject(Reflector) private reflector: Reflector, private userService:UserService) {
    super();
    console.log('Reflector in constructor:', this.reflector);
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('AuthGuard is triggered');
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    console.log('Extracted token:', token);
  
    if (!token) {
      console.log('No token found');
      throw new UnauthorizedException('No token, please login');
    }
  
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      console.log('Decoded token payload:', payload);
      request['user'] = payload;
      const user = await this.userService.findById(payload.userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    } console.log('Full user object:', user);

      request.user = user; // Attach the full user object to the request
      return true;
    }catch (error) {
      console.error('Token verification failed:', error.message);
      throw new UnauthorizedException('Invalid token');
    }
  }
  

  private extractTokenFromHeader(request: Request): string | undefined {
    return request.cookies?.AccessToken || request.headers['authorization']?.split(' ')[1];
  }
}

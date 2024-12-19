/* eslint-disable prettier/prettier */
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService,private reflector: Reflector) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
          ]);
          if (isPublic) {
            return true;
          }
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        console.log("token",token);
        if (!token) {
            throw new UnauthorizedException('No token, please login');
        }
            const payload = await this.jwtService.verifyAsync(
                token,
                {
                    secret: process.env.JWT_SECRET
                }
            );
            console.log("payload",payload);
            // 💡 We're assigning the payload to the request object here
            // so that we can access it in our route handlers
            request['user'] = payload;
            console.log(payload);
        return true;
    }
    private extractTokenFromHeader(request: Request): string | undefined {
        const token = request.cookies?.token || request.headers['authorization']?.split(' ')[1];
        console.log('Extracted Token:', token);
        return token;
    }
}
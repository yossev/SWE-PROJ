/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,  // Ensure this secret is defined in your .env file
    } as StrategyOptions);
  }

  async validate(payload: any) {
    console.log('JWT Payload:', payload);  // Log payload to debug
    const user = await this.userService.findById(payload.userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
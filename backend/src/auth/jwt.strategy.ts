/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { InjectModel } from '@nestjs/mongoose';  // Use @InjectModel for Mongoose
import { Model } from 'mongoose';
import { User } from '../models/user-schema';  // Adjust the import path if needed

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name) // Inject the User model for Mongoose
    private usersModel: Model<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET, // Ensure the JWT_SECRET is set in your environment
    });
  }

  async validate(payload: any) {
    const { id } = payload;  // Assuming the payload contains the user's ID

    // Find the user by the ID from the payload
    const user = await this.usersModel.findById(id);  // Use findById for MongoDB

    if (!user) {
      throw new UnauthorizedException('Login first to access this endpoint.');
    }

    return user;  // Return the user document if found
  }
}

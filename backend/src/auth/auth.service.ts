/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/models/user-schema';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken, RefreshTokenDocument} from'../models/refreshToken-schema';
import { LoginDto } from '../user/dto/login.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {

  constructor(
   
    @InjectModel(User.name) private  userModel: Model<UserDocument>, // <-- This is likely causing the error
  @InjectModel(RefreshToken.name) private  refreshTokenModel: Model<RefreshTokenDocument>,
  private readonly jwtService: JwtService,
  @Inject(forwardRef(() => UserService))
  private readonly userService: UserService,
  ) {}
  async createAccessToken(userId: string) {
    return await this.jwtService.signAsync({ userId });
  }
  private async generateRefreshToken(userId: string): Promise<string> {
    const refreshToken = this.jwtService.sign(
      { id: userId },
      { expiresIn: '7d' }, // Refresh token valid for 7 days
    );

    const refreshTokenDocument = new this.refreshTokenModel({
      userId,
      refreshToken,
      browser: 'default-browser', // Example: Replace with actual browser info
    });

    await refreshTokenDocument.save();
    return refreshToken;
  }
  async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string }> {
    // Verify refresh token
    const decoded = this.jwtService.verify(refreshToken);
    const { id } = decoded;

    // Check if refresh token exists in DB
    const existingToken = await this.refreshTokenModel.findOne({ refreshToken }).exec();
    if (!existingToken) {
      throw new UnauthorizedException('Invalid refresh token.');
    }

    // Generate new access token
    const accessToken = this.jwtService.sign({ id });
    return { accessToken };
  }
  async logout(refreshToken: string): Promise<void> {
    await this.refreshTokenModel.findOneAndDelete({ refreshToken }).exec();
  }
  private static jwtExtractor(request) {
    let token = null;
    if (request.headers['x-token']) {
      token = request.headers['x-token'];
    } else if (request.headers.authorization) {
      const authHeader = request.headers.authorization;
      token = authHeader.split(' ')[1];
    } else if (request.body.token) {
      token = request.body.token;
    } else if (request.query.token) {
      token = request.query.token;
    }
    return token;
  }

  returnJwtExtractor() {
    return AuthService.jwtExtractor;
  }
  async findRefreshToken(token: string) {
    const refreshToken = await this.refreshTokenModel.findOne({
      refreshToken: token,
    });
    if (!refreshToken) {
      throw new UnauthorizedException('User has been logged out.');
    }
    return refreshToken.userId;
  }
  }



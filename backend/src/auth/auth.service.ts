/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/models/user-schema';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken, RefreshTokenDocument} from'../models/refreshToken-schema';
import { LoginDto } from '../user/dto/login.dto';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(RefreshToken.name) private refreshTokenModel: Model<RefreshTokenDocument>,
    private jwtService: JwtService,  // JwtService is injected here
  ) {}

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
  }



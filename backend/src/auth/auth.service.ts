/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { createUserDto } from '../user/dto/createUser.dto';

import * as bcrypt from 'bcrypt';
import { User, UserDocument } from 'models/user-schema';
import updateUserDto from 'src/user/dto/updateUser.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password_hash, refresh_token, ...result } = user.toObject();
    return result;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user._id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(userDetails: createUserDto) {
    const hashedPassword = await bcrypt.hash(userDetails.password_hash, 10);
    const user = new this.userModel({
      ...userDetails,
      password_hash: hashedPassword,
    });
    return user.save();
  }

  async clearRefreshToken(userId: string) {
    await this.userModel.findByIdAndUpdate(userId, { refresh_token: null });
    return { message: 'Logged out successfully' };
  }

  async validateRefreshToken(refreshToken: string): Promise<User> {
    try {
      const payload = this.jwtService.verify(refreshToken, { ignoreExpiration: false });
      const user = await this.userModel.findById(payload.sub);
      if (!user || user.refresh_token !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      return user; // Return the validated user
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async getUserProfile(userId: string) {
    const user = await this.userModel.findById(userId).select('-password_hash -refresh_token').exec();
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  async updateUserProfile(userId: string, updateData: updateUserDto) {
    // If the update includes password, hash it
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(userId, updateData, { new: true }).exec();
    if (!updatedUser) {
      throw new UnauthorizedException('User not found');
    }

    return updatedUser;
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password_hash);
    if (!isOldPasswordValid) {
      throw new UnauthorizedException('Invalid old password');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password_hash = hashedNewPassword;
    await user.save();
    return { message: 'Password changed successfully' };
  }

  async getRoleBasedData(role: string) {
    if (role === 'student') {
      return { message: 'Student data' };
    } else if (role === 'instructor') {
      return { message: 'Instructor data' };
    } else if (role === 'admin') {
      return { message: 'Admin data' };
    } else {
      throw new ForbiddenException('Invalid role');
    }
  }
}

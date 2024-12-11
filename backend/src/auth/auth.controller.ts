/* eslint-disable prettier/prettier */
// auth.controller.ts
import { Controller, Post, Body, Request, UseGuards, Get, Put, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { createUserDto } from '../user/dto/createUser.dto';

import { JwtAuthGuard } from './guards/jwtAuth.guard';
import { LocalAuthGuard } from './guards/localAuth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Role, Roles } from './decorators/roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req: any) {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() userDetails: createUserDto) {
    return this.authService.register(userDetails);
  }
  

  @Post('protected')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async protectedEndpoint() {
    return { message: 'You have access to this protected endpoint!' };
  }
  @Post('refresh')
async refresh(@Body('refresh_token') refreshToken: string) {
  const user = await this.authService.validateRefreshToken(refreshToken);
  return this.authService.login(user);
}
  @Post('logout')
  @UseGuards(JwtAuthGuard)
async logout(@Request() req: any) {
  const userId = req.user.userId;
  await this.authService.clearRefreshToken(userId);
  return { message: 'Logged out successfully' };
}

@Get('profile')
@UseGuards(JwtAuthGuard)
async getProfile(@Request() req: any) {
  return this.authService.getUserProfile(req.user.userId);
}
@Put('profile')
@UseGuards(JwtAuthGuard)
async updateProfile(@Request() req: any, @Body() updateData: any) {
  const userId = req.user?.userId;

  // Ensure the user is authenticated
  if (!userId) {
    throw new UnauthorizedException('You must be logged in to update your profile');
  }

  return this.authService.updateUserProfile(userId, updateData);
}

@Put('change-password')
@UseGuards(JwtAuthGuard)
async changePassword(
  @Request() req: any,
  @Body() { oldPassword, newPassword }: { oldPassword: string; newPassword: string },
) {
  return this.authService.changePassword(req.user.userId, oldPassword, newPassword);
}

@Get('data')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Student, Role.Instructor, Role.Admin)
async getData(@Request() req: any) {
  const { role } = req.user;
  return this.authService.getRoleBasedData(role);
}

}
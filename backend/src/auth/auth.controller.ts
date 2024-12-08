import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth') // Example path, adjust as per your requirements
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('refresh') // Endpoint to refresh token
  async refreshAccessToken(@Body('refreshToken') refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }
    return await this.authService.refreshAccessToken(refreshToken);
  }
}

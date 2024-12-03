/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';  



import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterRequestDto } from '../auth/dto/RegisterRequestDto';  // Going up one level to 'auth' folder


import mongoose, { ObjectId, Types } from 'mongoose';
import { User } from 'models/user-schema';
import { InjectModel } from '@nestjs/mongoose';
@Injectable()
export class AuthService {
    constructor(
        private usersService: UserService,
        private jwtService: JwtService
    ) { }
    async register(user: RegisterRequestDto): Promise<string> {
        const existingUser = await this.usersService.findByEmail(user.email);
        if (existingUser) {
          throw new ConflictException('email already exists');
        }
        const userId = new mongoose.Types.ObjectId().toString();
        const hashedPassword = await bcrypt.hash(user.password_hash, 10);
        const newUser: User = {
            user_id: userId, // Unique user ID
            name: user.name,
            email: user.email,
            password_hash: hashedPassword,
            role: user.role,
            profile_picture_url: user.profilePictureUrl || '', // Use default if not provided
            created_at: new Date(), // Current timestamp
        };
        await this.usersService.create(newUser);
        return 'registered successfully';
      }

    async signIn(email: string, password: string): Promise<{ access_token: string; payload: { userid: string; role: string } }> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
        throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { userid: user.user_id, role: user.role }; // user_id is Types.ObjectId

    return {
        access_token: await this.jwtService.signAsync(payload),
        payload,
    };
}

}
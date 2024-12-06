/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';  



import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterRequestDto } from '../auth/dto/RegisterRequestDto';  // Going up one level to 'auth' folder


import mongoose, { Model, ObjectId, Types } from 'mongoose';
import { User } from 'models/user-schema';
import { InjectModel } from '@nestjs/mongoose';
@Injectable()
export class AuthService {
    constructor(
        private usersService: UserService,
        private jwtService: JwtService,
        @InjectModel('User') private readonly userModel: Model<User>,
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

      async signIn(email: string, password: string): Promise<{ access_token: string; payload: any }> {
        console.log(`Attempting login for email: ${email}`);
      
        const user = await this.userModel.findOne({ email });
        if (!user) {
          console.error('User not found');
          throw new HttpException('Invalid email or password', HttpStatus.UNAUTHORIZED);
        }
      
        console.log('User found, validating password...');
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
          console.error('Invalid password');
          throw new HttpException('Invalid email or password', HttpStatus.UNAUTHORIZED);
        }
      
        console.log('Password validated, generating token...');
        const payload = { userId: user.id, role: user.role };
        const access_token = this.jwtService.sign(payload);
      
        console.log('Token generated successfully');
        return { access_token, payload };
      }
      

}
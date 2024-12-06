/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/models/user-schema';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

import { LoginDto } from '../user/dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,  // JwtService is injected here
  ) {}

  

    
  }



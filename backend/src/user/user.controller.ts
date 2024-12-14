/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, NotFoundException, Param, Post, Put, Query, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/models/user-schema';
import * as bcrypt from 'bcrypt';

import { createUserDto } from './dto/createUser.dto';
import updateUserDto from './dto/updateUser.dto';

import { AuthGuard } from '../auth/guards/authentication.guards';
import { Public } from '../auth/decorators/public.decorator';
import { authorizationGuard } from 'src/auth/guards/authorization.guards';
import { Role, Roles } from '../auth/decorators/roles.decorator';
import mongoose from 'mongoose';
import { LoginDto } from './dto/login.dto';
import { RefreshAccessTokenDto } from './dto/refreshAccessTokenDto.dto';
import { ProgressService } from 'src/progress/progress.service';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';

// @UseGuards(AuthGuard) //class level
@Controller('users') // it means anything starts with /student
export class UserController {
    constructor(private userService: UserService,private readonly progressService: ProgressService,private jwtService:JwtService) { }
    @Get('/all') 
    @Roles(Role.Instructor, Role.Admin)
    @UseGuards(AuthGuard)
    // Get all students
    async getAllStudents(): Promise<User[]> {
        return await this.userService.findAll();
    }
    @Roles(Role.Instructor, Role.Admin)
    @UseGuards(authorizationGuard)
    @Get('by-email')
    async getUserByEmail(@Query('email') email: string): Promise<User> {
      if (!email) {
        throw new BadRequestException('Email is required');
      }
      return this.userService.findByEmail(email);
    }
  
    @Roles(Role.Instructor, Role.Admin)
    @UseGuards(authorizationGuard)
    @Get('fetch/:id')// /student/:id
    // Get a single student by ID
    async getUserById(@Param('id') id: string):Promise<User> {// Get the student ID from the route parameters
        const user = await this.userService.findById(id);
        return user;
    }

    //Create a new student
    /*@Public()
    @Post('/login')
    async login(@Body() loginDto: LoginDto, @Res({passthrough : true}) res: Response) {
      const jsonRes = await this.userService.login(loginDto, res);
      console.log(jsonRes);
      return jsonRes;
   }*/
    /*@Public()
    @Post('/register')
    async register(@Body()userData: createUserDto) {// Get the new student data from the request body

        // Hash the password before saving
        const passwordHash = await bcrypt.hash(userData.password_hash, 10);
        userData.password_hash=passwordHash;
        
       const newUser = await this.userService.register(userData);
       return newUser;
    }*/
    // Update a student's details
   
    @Put('me')
    @UseGuards(AuthGuard)
    async updateUserProfile(@Req() req, @Body() updateData: updateUserDto) {
      console.log('Entered function');
      console.log('Cookies in request:', req.cookies);
    
      const token = req.cookies['AccessToken'];
      if (!token) {
        throw new UnauthorizedException('No token provided');
      }
    
      try {
        const payload = await this.jwtService.verifyAsync(token, {
          secret: process.env.JWT_SECRET,
        });
        console.log('Decoded JWT payload:', payload);
    
        const userId = payload.userId;
        console.log('User ID is:', userId);
    
        const updatedUser = await this.userService.update(userId, updateData);
        console.log('Updated user data:', updatedUser);
    
        return updatedUser;
      } catch (error) {
        console.error('Token verification failed:', error);
        throw new UnauthorizedException('Invalid token');
      }
    }
   
  

    
    // Delete a student by ID
    @Delete(':id')
    async deleteUser(@Param('id')id:string) {
        const deletedUser = await this.userService.delete(id);
       return deletedUser;
    }
    @Get('completed/:userId')
  async getCompletedCourses(@Param('userId') userId: string) {
    return await this.progressService.getCompletedCourses(userId);
  }
  @Post('logout')
  async logout(@Res() res: Response) {
    return this.userService.logout(res);
  }
    /*
    @Post('token/refresh')
  @HttpCode(HttpStatus.CREATED)
  async refreshAccessToken(
    @Body() refreshAccessTokenDto: RefreshAccessTokenDto,
  ) {
    try {
      return await this.userService.refreshAccessToken(refreshAccessTokenDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
    */
    // @Get('courses')
    // async getAllCourses() {
    //     return await this.userService.findAllCourses();
    // }
}
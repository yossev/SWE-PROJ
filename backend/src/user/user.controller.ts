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
    @UseGuards(authorizationGuard)
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

    @Roles(Role.Instructor, Role.Admin)
    @UseGuards(authorizationGuard)
    @Get('fetch/:name')// /student/:id
    // Get a single student by ID
    async getUserByName(@Param('name') name: string):Promise<User> {
        const user = await this.userService.findByName(name);
        return user;
    }
    @Roles(Role.Admin)
    @UseGuards(authorizationGuard)
    @Get('instructors')
    async getInstructors(): Promise<User[]> {
      return this.userService.findAllInstructors();
    }
    @Roles(Role.Admin,Role.Instructor)
    @UseGuards(authorizationGuard)
    @Get('instructorstudents')
    async getStudentsByInstructors(@Param('id')instructorId:string): Promise<User[]> {
      return this.userService.findStudentsByInstructor(instructorId);
    }
    // Update a student's details
   
    @Put('me')
    @UseGuards(AuthGuard)
    async updateUserProfile(@Req() req, @Body() updateData: updateUserDto) {
      console.log('Entered function');
      console.log('Cookies in request:', req.cookies);
      const userId = req.cookies.userId;
      const updatedUser = await this.userService.update(userId, updateData);
      console.log('Updated user data:', updatedUser);
    
        return updatedUser;
      } catch (error) {
        console.error('Token verification failed:', error);
        throw new UnauthorizedException('Invalid token');
      }
    
   

    // Delete a student by ID
    @Delete('delete/:id')
    @Roles(Role.Admin)
    @UseGuards(authorizationGuard)
    async deleteUser(@Param('id')id:string) {
        const deletedUser = await this.userService.delete(id);
       return deletedUser;
    }
    @Delete('deleteme/:id')
    @UseGuards(AuthGuard)
    async deleteMe(@Param('id')id:string) {
        const deletedUser = await this.userService.delete(id);
       return deletedUser;
    }

    @Get('completed/:userId')
    @Roles(Role.Student)
    @UseGuards(authorizationGuard)
    async getCompletedCourses(@Req() req) {
      return await this.progressService.getCompletedCourses(req.cookies.userId);
    }
    @Get('courses')
    @UseGuards(AuthGuard)
    async getCourses(@Req() req) {
      const userid = req.cookies.userId;
      if (!userid) {
        throw new UnauthorizedException('No token provided');
      }
    
      try {
        const user= this.userService.findById(userid);
        return (await user).courses;
      } catch (error) {
        console.error('Token verification failed:', error);
        throw new UnauthorizedException('Invalid token');
      }
    }
    @Post('logout')
    async logout(@Res({passthrough:true}) res: Response) {
      return await this.userService.logout(res);
    }
  
}
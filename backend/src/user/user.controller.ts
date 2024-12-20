/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, NotFoundException, Param, Post, Put, Query, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/models/user-schema';
import * as bcrypt from 'bcrypt';

import { createUserDto } from './dto/createUser.dto';
import updateUserDto from './dto/updateUser.dto';

import { AuthGuard } from '../auth/guards/auth.guards';
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

    @Roles(Role.Instructor)
    @UseGuards(authorizationGuard)
    @Get('Studentfetch/:name') // /student/:id
    async getStudentByName(@Param('name') name: string): Promise<User> {
      const user = await this.userService.findByNameAndRole(name, 'student');
    
      if (!user) {
        throw new NotFoundException('Instructor not found');
      }
    
      return user;
    
    }
    @Roles(Role.Student)
    @UseGuards(authorizationGuard)
    @Get('Instructorfetch/:name') // /student/:id
    async getInstructorByName(@Param('name') name: string): Promise<User> {
      const user = await this.userService.findByNameAndRole(name, 'instructor');
    
      if (!user) {
        throw new NotFoundException('Instructor not found');
      }
    
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
    @Roles(Role.Student,Role.Instructor)
    @UseGuards(authorizationGuard)
    @Put('me')
    @UseGuards(AuthGuard)
    async updateUserProfile(@Req() req, @Body() updateData: updateUserDto) {
   
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
    @Roles(Role.Student,Role.Instructor)
    @UseGuards(authorizationGuard)
    async deleteMe(@Req() req) {
      const userId = req.cookies.userId;
        const deletedUser = await this.userService.delete(userId);
       return deletedUser;
    }

    @Get('completed/:userId')
    @Roles(Role.Student)
    @UseGuards(authorizationGuard)
    async getCompletedCourses(@Req() req) {
      return await this.progressService.getCompletedCourses(req.cookies.userId);
    
    }
    @Post('logout')
    @Roles(Role.Student,Role.Instructor)
    @UseGuards(authorizationGuard)
    async logout(@Res({passthrough:true}) res: Response) {
      return await this.userService.logout(res);
    }
    @UseGuards(authorizationGuard)
    @Roles(Role.Student)
    @Get('mycourses')
    getMyCourses(@Req() req) {
        return this.userService.getMyCourses(req);
    
    }
    @UseGuards(authorizationGuard)
    @Roles(Role.Instructor)
    @Get('Studentcourses/:userId')
    getStudentCourses(@Param('userId') userId: string) {
        return this.userService.getStudentCourses(userId);
}
}
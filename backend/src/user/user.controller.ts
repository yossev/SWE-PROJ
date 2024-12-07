/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, NotFoundException, Param, Post, Put, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/models/user-schema';
import * as bcrypt from 'bcrypt';

import { createUserDto } from './dto/createUser.dto';
import updateUserDto from './dto/updateUser.dto';

import { JwtAuthGuard } from '../auth/guards/jwtAuthGuard.guard';
import { AuthGuard } from '../auth/guards/authentication.guards';
import { Public } from '../auth/decorators/public.decorator';

import { Role, Roles } from '../auth/decorators/roles.decorator';
import { authorizationGuard } from '../auth/guards/authorization.guards';
import mongoose from 'mongoose';
import { LoginDto } from './dto/login.dto';
import { RefreshAccessTokenDto } from './dto/refreshAccessTokenDto.dto';



// @UseGuards(AuthGuard) //class level
@Controller('users') // it means anything starts with /student
export class UserController {
    constructor(private userService: UserService) { }
    @Get('/all') 
    @Roles(Role.Instructor, Role.Admin)
    @UseGuards(JwtAuthGuard)
    // Get all students
    async getAllStudents(): Promise<User[]> {
        return await this.userService.findAll();
    }

    @Roles(Role.Instructor, Role.Admin)
    @UseGuards(JwtAuthGuard)
    @Get(':id')// /student/:id
    // Get a single student by ID
    async getUserById(@Param('id') id: string):Promise<User> {// Get the student ID from the route parameters
        const user = await this.userService.findById(id);
        return user;
    }
    @Delete('me') // We can use 'me' as a route to delete the logged-in user
    async delete(@Req() req): Promise<any> {
      const currentUser = req.user;
  
      if (!currentUser) {
        throw new UnauthorizedException('You must be logged in to delete your account.');
      }
  
      // Call the delete method, passing in the current user's ID
      return await this.userService.delete(currentUser._id);
    }
  
    @Get('instructor/:username')
    async findInstructorByName(@Param('username') username: string): Promise<User> {
      const instructor = await this.userService.findByName(username);
      if (!instructor) {
        throw new NotFoundException(`Instructor with username "${username}" not found.`);
      }
      return instructor;
    }
    @Get('instructors')
   
    async getAllInstructors(@Req() req): Promise<User[]> {
      const currentUser = req.user
  
      // Students requesting all instructors
      return await this.userService.findAll('student');
    }
  
    @Get('students')
    @Roles(Role.Instructor) 
    @UseGuards(JwtAuthGuard)// Only instructors can access this route
    async getStudents(@Req() req): Promise<User[]> {
      const currentUser = req.user;
  
      if (!currentUser || currentUser.role !== Role.Instructor) {
        throw new UnauthorizedException('You must be an instructor to access this resource.');
      }
  
      // Instructors requesting students in their courses
      return await this.userService.findAll('instructor', currentUser._id);
    }
  
    //Create a new student
    @Public()
    @Post('/login')
    login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
        
        return this.userService.login(loginDto);
     }
    @Public()
    @Post('/register')
    async register(@Body()userData: createUserDto) {// Get the new student data from the request body

        // Hash the password before saving
        const passwordHash = await bcrypt.hash(userData.password_hash, 10);
        userData.password_hash=passwordHash;
        
       const newUser = await this.userService.register(userData);
       return newUser;
    }
    // Update a student's details
   
    @Put('me')
    async updateUserProfile(@Param() req, @Body() updateData: updateUserDto) {
        const userId = req.user.userId; // Extract logged-in user's ID from request
        return await this.userService.update(userId, updateData);
    }
    
    // Delete a student by ID
    @Delete(':id')
    async deleteUser(@Param('id')id:string) {
        const deletedUser = await this.userService.delete(id);
       return deletedUser;
    }
    
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
    // @Get('courses')
    // async getAllCourses() {
    //     return await this.userService.findAllCourses();
    // }
}
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, InternalServerErrorException, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
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
    @UseGuards(JwtAuthGuard)
    @Roles(Role.Instructor, Role.Admin)
    // Get all students
    async getAllStudents(): Promise<User[]> {
        return await this.userService.findAll();
    }

    @Roles(Role.Instructor, Role.Admin)
    @UseGuards(authorizationGuard)
    @Get(':id')// /student/:id
    // Get a single student by ID
    async getUserById(@Param('id') id: string):Promise<User> {// Get the student ID from the route parameters
        const user = await this.userService.findById(id);
        return user;
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
        const userId = req.user._id; // Extract logged-in user's ID from request
        try {
          return await this.userService.update(userId, updateData);
        } catch (error) {
          console.error("Error updating user:", error);
          throw new InternalServerErrorException("Failed to update user profile");
        }
        
    }
    
    // Delete a student by ID
    @Roles(Role.Admin)
    @UseGuards(authorizationGuard)
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
/* eslint-disable prettier/prettier */
import { Controller, Get, Param, Put, Body, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'models/user-schema';
import { Role, Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import updateUserDto from './dto/updateUser.dto';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard) // Apply authentication and role checks globally to all routes in this controller
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Only admins can view all users
  @Get()
  @Roles(Role.Admin)
  async getAllUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  // Admins and instructors can view user details by ID
  @Get(':id')
  @Roles(Role.Admin, Role.Instructor)
  async getUserById(@Param('id') id: string): Promise<User> {
    return this.userService.findById(id);
  }

  // Admins can update any user
  @Put(':id')
  @Roles(Role.Admin)
  async updateUser(@Param('id') id: string, @Body() updateData: updateUserDto): Promise<User> {
    return this.userService.updateUser(id, updateData);
  }

  // Only admins can delete users
  @Delete(':id')
  @Roles(Role.Admin)
  async deleteUser(@Param('id') id: string): Promise<{ message: string }> {
    return this.userService.deleteUser(id);
  }
}

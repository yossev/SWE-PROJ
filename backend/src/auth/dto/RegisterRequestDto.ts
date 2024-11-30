/* eslint-disable prettier/prettier */
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class RegisterRequestDto {
    @IsString()
    user_id: Types.ObjectId;

    @IsEmail()
    email: string;

    @IsString()
    name: string;

    @MinLength(8)
    password_hash: string;

    @IsString()
    role: string = 'student'; // Defaults to student

    @IsOptional()
    profilePictureUrl: string; // Optional field for profile picture

    @IsOptional()
    enrolledCourses?: string[]; // Array of course IDs
}
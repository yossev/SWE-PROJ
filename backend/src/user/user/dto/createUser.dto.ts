// createUser.dto.ts
import { Course,CourseSchema } from 'models/course-schema';  // Assuming you want to use the Course schema
import {IsOptional} from 'class-validator';
import { Types } from 'mongoose';
export class createUserDto {
    user_id:string;
    email: string;            // Email is required
    name: string;               // Name is required
    password_hash: string;           // Raw password; this will be hashed in the service layer
    role: 'student' | 'instructor' | 'admin';
    @IsOptional()  // Role is required, but must be one of these three
    profile_picture_url?: string;  // Optional URL for the profile picture
    courses?: Types.ObjectId[]; 
    created_at :  Date; 

     // Optional list of courses (if the user is associated with courses)
}

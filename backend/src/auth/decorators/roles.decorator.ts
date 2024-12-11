/* eslint-disable prettier/prettier */
// roles.decorator.ts
import { SetMetadata } from '@nestjs/common';

export enum Role {
  Instructor = 'instructor',
  Student = 'student',
  Admin = 'admin',
 
}

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);

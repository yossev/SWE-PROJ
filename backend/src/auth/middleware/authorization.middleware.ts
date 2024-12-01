/* eslint-disable prettier/prettier */
// Enhanced Authorization Middleware
import { UnauthorizedException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

/**
 * Role-Based Access Control (RBAC) Middleware
 * Checks if the user has access to the requested endpoint based on roles.
 * @param roles - Array of allowed roles (e.g., ['student', 'instructor', 'admin'])
 */
const isUserAuthorized = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = res.locals.user; // Retrieve user from res.locals

    if (!user || !roles.includes(user.role)) {
      throw new UnauthorizedException('User does not have the required role');
    }
    next();
  };
};

export default isUserAuthorized;
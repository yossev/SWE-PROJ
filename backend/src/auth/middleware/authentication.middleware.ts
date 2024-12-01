/* eslint-disable prettier/prettier */
// Enhanced Authentication Middleware
import { UnauthorizedException } from '@nestjs/common/exceptions/unauthorized.exception';
import { Request, Response, NextFunction } from 'express';
import { verify, TokenExpiredError } from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();

export function AuthenticationMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.token || req.headers['authorization']?.split(' ')[1];

  if (!token) {
    throw new UnauthorizedException('Authentication token missing');
  }

  try {
    const decoded: any = verify(token, String(process.env.JWT_SECRET));
    res.locals.user = decoded.user; // Attach user payload to res.locals for secure handling
    next(); 
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      throw new UnauthorizedException('Token expired, please login again');
    }
    throw new UnauthorizedException('Invalid token');
  }
}
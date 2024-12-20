/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ResponseSchema } from '../models/responses-schema';
import { ResponseService } from './response.service';
import { ResponseController } from './response.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Responses', schema: ResponseSchema }]),  
  ],
  controllers: [ResponseController],  
  providers: [ResponseService,JwtService],  
})
export class ResponseModule {}

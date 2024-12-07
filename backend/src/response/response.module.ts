import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ResponseService } from './response.service';
import { ResponseController } from './response.controller';
import { ResponseSchema } from 'models/responses-schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Response', schema: ResponseSchema }]),  
  ],
  controllers: [ResponseController],  
  providers: [ResponseService],  
})
export class ResponseModule {}

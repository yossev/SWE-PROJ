import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Responses, ResponseSchema } from '../../models/responses-schema';
import { ResponseService } from './response.service';
import { ResponseController } from './response.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Response.name, schema: ResponseSchema }]),  
  ],
  controllers: [ResponseController],  
  providers: [ResponseService],  
})
export class ResponseModule {}
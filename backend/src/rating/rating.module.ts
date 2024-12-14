/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RatingController } from './rating.controller';
import { RatingService } from './rating.service';
import { RatingSchema } from '../models/rating-schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Rating', schema: RatingSchema }]),
  ],
  controllers: [RatingController],
  providers: [RatingService],
})

 export class RatingModule {}

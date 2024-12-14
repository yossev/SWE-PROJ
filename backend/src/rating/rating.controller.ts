/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Put, Param, Get, NotFoundException, Delete} from '@nestjs/common';
import { RatingService } from './rating.service';
import { CreateRatingDto } from './dto/createRating.dto';
import { UpdateRatingDto } from './dto/updateRating.dto';
import { Rating } from '../models/rating-schema';

@Controller('ratings')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Post()
  async createRating(@Body() createRatingDto: CreateRatingDto): Promise<Rating> {
    return await this.ratingService.createRating(createRatingDto);
  }

  @Put(':id')
  async updateRating(
    @Param('id') id: string,
    @Body() updateRatingDto: UpdateRatingDto,
  ): Promise<Rating> {
    return await this.ratingService.updateRating(id, updateRatingDto);
  }


  @Get()
  async findAll(): Promise<Rating[]> {
    return await this.ratingService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Rating> {
    try {
      return await this.ratingService.findOne(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
}

  @Get('course-rating/:courseId')
  async getCourseRating(@Param('courseId') courseId: string): Promise<number> {
    return await this.ratingService.getCourseRating(courseId);
  }

  @Get('instructor-rating/:instructorId')
  async getInstructorRating(@Param('instructorId') instructorId: string): Promise<number> {
    return await this.ratingService.getInstructorRating(instructorId);
  }

  @Get('module-rating/:moduleId')
  async getModuleRating(@Param('moduleId') moduleId: string): Promise<number> {
    return await this.ratingService.getModuleRating(moduleId);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.ratingService.delete(id);
  }

}

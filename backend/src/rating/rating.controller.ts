import { Controller, Post, Body, Put, Param, Get, NotFoundException, Delete, BadRequestException } from '@nestjs/common';
import { RatingService } from './rating.service';
import { CreateRatingDto } from './dto/createRating.dto';
import { UpdateRatingDto } from './dto/updateRating.dto';
import { Rating } from '../../models/rating-schema';

@Controller('ratings')
export class RatingController {
  constructor(private readonly ratingService: RatingService) { }

  @Post('createrating')
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


  // @Get()
  // async findAll(): Promise<Rating[]> {
  //   return await this.ratingService.findAll();
  // }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Rating> {
    try {
      return await this.ratingService.findOne(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Get('module-rating/:moduleId')
  async getModuleRatingsByCourse(@Param('moduleId') courseId: string) {
    return await this.ratingService.getModuleRatingsByCourse(courseId);
  }


  @Get('course-rating/:courseId')
  async getCourseRatingFromModules(@Param('courseId') courseId: string) {
    return await this.ratingService.getCourseRatingFromModules(courseId);
  }


  @Get('instructor-rating/:instructorId')
  async getInstructorRating(@Param('instructorId') instructorId: string) {
    return await this.ratingService.getInstructorRating(instructorId);
  }

  @Post()
  async rateEntity(@Body() createRatingDto: CreateRatingDto) {
    try {
      return await this.ratingService.createRating(createRatingDto);
    } catch (error) {
      throw new BadRequestException('Error creating rating');
    }
  }

  @Post('rateinstructor')
  async rateInstructor(@Body() createRatingDto: CreateRatingDto) {
    try {
      return await this.ratingService.createRating(createRatingDto);
    } catch (error) {
      throw new BadRequestException('Error creating rating');
    }
  }

  @Get() 
  async getAllRatings() {
    try {
      return await this.ratingService.getAllRatings();
    } catch (error) {
      throw new NotFoundException('Error retrieving ratings');
    }
  }

 

}

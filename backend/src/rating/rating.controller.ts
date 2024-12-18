/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Put, Param, Get, NotFoundException, Delete, UseGuards} from '@nestjs/common';
import { RatingService } from './rating.service';
import { CreateRatingDto } from './dto/createRating.dto';
import { UpdateRatingDto } from './dto/updateRating.dto';
import { Rating } from '../models/rating-schema';
import { Role, Roles } from 'src/auth/decorators/roles.decorator';
import { authorizationGuard } from 'src/auth/guards/authorization.guards';

@Controller('ratings')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

@UseGuards(authorizationGuard)
@Roles(Role.Student)
  @Post('createrating')
  async createRating(@Body() createRatingDto: CreateRatingDto): Promise<Rating> {
    return await this.ratingService.createRating(createRatingDto);
  }

@UseGuards(authorizationGuard)
@Roles(Role.Student)
  @Put(':id')
  async updateRating(
    @Param('id') id: string,
    @Body() updateRatingDto: UpdateRatingDto,
  ): Promise<Rating> {
    return await this.ratingService.updateRating(id, updateRatingDto);
  }

@UseGuards(authorizationGuard)
@Roles(Role.Admin)
  @Get()
  async findAll(): Promise<Rating[]> {
    return await this.ratingService.findAll();
  }
  @UseGuards(authorizationGuard)
  @Roles(Role.Admin)
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
  @UseGuards(authorizationGuard)
  @Roles(Role.Student)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.ratingService.delete(id);
  }

}

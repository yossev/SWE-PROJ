/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Rating, RatingDocument } from '../models/rating-schema';
import mongoose from 'mongoose';
import { CreateRatingDto } from './dto/createRating.dto';
import { UpdateRatingDto } from './dto/updateRating.dto';
import { Module, ModuleDocument } from 'models/module-schema';


@Injectable()
export class RatingService {
    constructor(
        @InjectModel('Rating') private readonly ratingModel: Model<RatingDocument>,
        @InjectModel('Module') private readonly moduleModel: Model<Module>, 
    ) { }


    async createRating(createRatingDto: CreateRatingDto): Promise<Rating> {
        const newRating = new this.ratingModel(createRatingDto);
        return await newRating.save();
    }

    async updateRating(id: string, updateRatingDto: UpdateRatingDto): Promise<Rating> {
        return await this.ratingModel.findByIdAndUpdate(id, updateRatingDto, { new: true });
    }

    async findAll(): Promise<Rating[]> {
        return this.ratingModel.find().exec();
    }

    async findOne(id: string): Promise<Rating> {
        const rating = await this.ratingModel.findOne({ _id: id }).exec();
        if (!rating) {
            throw new NotFoundException(`Rating record with ID ${id} not found`);
        }
        return rating;
    }
    async getModuleRatingsByCourse(courseId: string): Promise<{ moduleId: string; averageRating: number }[]> {

        const modules = await this.moduleModel.find({ course_id: courseId }).select('_id').exec();
    
        const moduleRatings = [];
        for (const module of modules) {
    
            const ratings = await this.ratingModel.aggregate([
                { $match: { ratedEntity: 'Module', ratedEntityId: new mongoose.Types.ObjectId(module._id) } },
                { $group: { _id: '$ratedEntityId', averageRating: { $avg: '$rating' } } },
            ]);
    
            moduleRatings.push({
                moduleId: module._id.toString(),
                averageRating: ratings.length > 0 ? ratings[0].averageRating : 0,
            });
        }

        return moduleRatings;
    }
    
    async getCourseRatingFromModules(courseId: string): Promise<number> {
        const moduleRatings = await this.getModuleRatingsByCourse(courseId);

        
        const totalRating = moduleRatings.reduce((sum, module) => sum + module.averageRating, 0);
        const averageCourseRating = moduleRatings.length > 0 ? totalRating / moduleRatings.length : 0;

        return averageCourseRating;
    }

    
    async getInstructorRating(instructorId: string): Promise<number> {
        const ratings = await this.ratingModel.aggregate([
            { $match: { ratedEntity: 'Instructor', ratedEntityId: new mongoose.Types.ObjectId(instructorId) } },
            { $group: { _id: '$ratedEntityId', averageRating: { $avg: '$rating' } } },
        ]);

        return ratings.length > 0 ? ratings[0].averageRating : 0;
    }
}





   



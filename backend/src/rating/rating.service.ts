import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Rating, RatingDocument } from '../../models/rating-schema';
import { Module, ModuleDocument } from '../../models/module-schema';
import mongoose from 'mongoose';
import { CreateRatingDto } from './dto/createRating.dto';
import { UpdateRatingDto } from './dto/updateRating.dto';
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

    // Get ratings for modules associated with a course
    async getModuleRatingsByCourse(courseId: string): Promise<{ moduleId: string; averageRating: number | string }[]> {
        const modules = await this.moduleModel.find({ course_id: courseId }).select('_id').exec();
        const moduleRatings = [];

        for (const module of modules) {
            const ratings = await this.ratingModel.aggregate([
                { $match: { ratedEntity: 'Module', ratedEntityId: new mongoose.Types.ObjectId(module._id) } },
                { $group: { _id: '$ratedEntityId', averageRating: { $avg: '$rating' } } },
            ]);

            // If no ratings exist, display "No ratings yet"
            moduleRatings.push({
                moduleId: module._id.toString(),
                averageRating: ratings.length > 0 ? ratings[0].averageRating : "No ratings yet", // Return string message instead of 0
            });
        }

        return moduleRatings;
    }

    // Get average rating for the course, based on the module ratings
    async getCourseRatingFromModules(courseId: string): Promise<number | string> {
        const moduleRatings = await this.getModuleRatingsByCourse(courseId);
        const totalRating = moduleRatings.reduce((sum, module) => sum + (typeof module.averageRating === "number" ? module.averageRating : 0), 0);
        const averageCourseRating = moduleRatings.length > 0 ? totalRating / moduleRatings.length : "No ratings yet"; // Return string if no ratings

        return averageCourseRating;
    }

    // Get the instructor's average rating based on ratings for modules taught by them
    async getInstructorRating(instructorId: string): Promise<number | string> {
        const ratings = await this.ratingModel.aggregate([
            { $match: { ratedEntity: 'Instructor', ratedEntityId: new mongoose.Types.ObjectId(instructorId) } },
            { $group: { _id: '$ratedEntityId', averageRating: { $avg: '$rating' } } },
        ]);

        return ratings.length > 0 ? ratings[0].averageRating : "No ratings yet"; // Return string if no ratings
    }
}

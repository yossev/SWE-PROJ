/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Rating, RatingDocument } from '../models/rating-schema';
import mongoose from 'mongoose';
import { CreateRatingDto } from './dto/createRating.dto';
import { UpdateRatingDto } from './dto/updateRating.dto';

@Injectable()
export class RatingService {
    constructor(@InjectModel(Rating.name) private ratingModel: Model<RatingDocument>) { }

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


    async getCourseRating(courseId: string): Promise<number> {
        const ratings = await this.ratingModel
            .aggregate([ // Filtering the documents to only include the ones where ratedEntity: 'Course'
                // Check that the ratedEntityId (id of course) matches the courseId.
                { $match: { ratedEntity: 'Course', ratedEntityId: new mongoose.Types.ObjectId(courseId) } },
                // group documents that match together to calculate average rating for all
                { $group: { _id: '$ratedEntityId', averageRating: { $avg: '$rating' } } },
            ]);
        // Check if ratings are larger than 0 meaning there are ratings for this course, if so it will take the 
        //first element (the one that contains the average) will be returned
        return ratings.length > 0 ? ratings[0].averageRating : 0;
    }

    async getInstructorRating(instructorId: string): Promise<number> {
        const ratings = await this.ratingModel
            .aggregate([
                { $match: { ratedEntity: 'Instructor', ratedEntityId: new mongoose.Types.ObjectId(instructorId) } },
                { $group: { _id: '$ratedEntityId', averageRating: { $avg: '$rating' } } },
            ]);
        return ratings.length > 0 ? ratings[0].averageRating : 0;
    }
    async getModuleRating(moduleId: string): Promise<number> {
        const ratings = await this.ratingModel
            .aggregate([
                { $match: { ratedEntity: 'Module', ratedEntityId: new mongoose.Types.ObjectId(moduleId) } },
                { $group: { _id: '$ratedEntityId', averageRating: { $avg: '$rating' } } },
            ]);
        return ratings.length > 0 ? ratings[0].averageRating : 0;
    }

    // might use this in progress -- not sure yet
    async getAllRatings(courseId: string, moduleId: string, instructorId: string) {
        const courseRating = await this.getCourseRating(courseId);
        const moduleRating = await this.getModuleRating(moduleId);
        const instructorRating = await this.getInstructorRating(instructorId);

        return {
            courseRating,
            moduleRating,
            instructorRating,
        };
    }

    async delete(id: string): Promise<void> {
        const result = await this.ratingModel.deleteOne({ _id: id });

        if (result.deletedCount === 0) {
            throw new NotFoundException(`Rating record with ID ${id} not found`);
        }
    }
}

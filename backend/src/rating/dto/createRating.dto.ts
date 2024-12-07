export class CreateRatingDto {
    rating: number;

    ratedEntity: 'Module' | 'Course' | 'Instructor';

    ratedEntityId: string;

    userId: string;
}
export class CreateRatingDto {
    rating: number;

    ratedEntity: 'Module' | 'Course' | 'Instructor';

    ratedEntityId: string;

    user_id: string;
}
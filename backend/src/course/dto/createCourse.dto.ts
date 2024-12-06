export class CreateCourseDto {
    id: string; 
    title: string;
    description: string;
    category: string;
    difficulty_level: 'Beginner' | 'Intermediate' | 'Advanced';
    created_by: string;
  }

  // Might have to handle Assertions later ~Yossef
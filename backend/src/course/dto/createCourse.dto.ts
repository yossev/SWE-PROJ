export class CreateCourseDto {
    userId(userId: any, arg1: string, courseName: any) {
      throw new Error('Method not implemented.');
    }
    courseName(userId: any, arg1: string, courseName: any) {
      throw new Error('Method not implemented.');
    }
    id: string; 
    title: string;
    description: string;
    category: string;
    difficulty_level: 'Beginner' | 'Intermediate' | 'Advanced';
    created_by: string;
  }

  // Might have to handle Assertions later ~Yossef
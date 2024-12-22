import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Note , NoteSchema } from 'models/note-schema';
import { Course, CourseSchema } from 'models/course-schema';
import { User , UserSchema } from 'models/user-schema';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';

@Module({
    imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
    MongooseModule.forFeature([{ name: 'Note', schema: NoteSchema }])],
    controllers: [NotesController],
    providers: [NotesService]
})
export class NotesModule {}
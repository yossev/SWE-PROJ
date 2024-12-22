import { Inject, Injectable } from "@nestjs/common";

import { CreateNoteDto } from "./dto/createNote.dto";
import { UpdateNoteDto } from "./dto/updateNote.dto";
import { Model } from "mongoose";
import mongoose from "mongoose";
import { create } from "domain";

import { InjectModel } from "@nestjs/mongoose";
import { Course, CourseDocument } from "src/models/course-schema";
import { NoteDocument } from "src/models/note-schema";
import { User, UserDocument } from "src/models/user-schema";


@Injectable()
export class NotesService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
        @InjectModel(Course.name) private readonly courseModel: Model<CourseDocument>,
        @InjectModel('Note') private readonly noteModel: Model<NoteDocument>,
    ) {}

    async createNote(createNoteDto : CreateNoteDto)
    {
        const note = new this.noteModel(createNoteDto);
        await note.save();
        return "Note created";
    }

    async getNote(id : string , userId : string)
    {
        const note = await this.noteModel.findById(new mongoose.Types.ObjectId(id)).exec();
        if(note)
        {
            if(note.user_id.toString() === userId)
            {
                return note;
            }
            else
            {
                throw new Error("You are not authorized to view this note");
            }
        }
        else
        {
            throw new Error("Note not found");
        }
    }

    async updateNote(id : string , userId : string , updateNoteDto : UpdateNoteDto)
    {
        const note = await this.noteModel.findById(new mongoose.Types.ObjectId(id)).exec();
        console.log(note);
        if(note)
        {
            if(note.user_id.toString() === userId)
            {
                updateNoteDto.last_at = new Date();
                Object.assign(note, updateNoteDto);
                return note.save();
            }
            else
            {
                throw new Error("You are not authorized to update this note");
            }
        }
        else
        {
            throw new Error("Note not found");
        }
    }

    async deleteNote(id : string , userId : string)
    {
        const note = await this.noteModel.findById(new mongoose.Types.ObjectId(id)).exec();
        
        if(note)
        {
            if(note.user_id.toString() === userId)
            {
                await this.noteModel.findByIdAndDelete(new mongoose.Types.ObjectId(id));
                return "Note deleted";
            }
            else
            {
                throw new Error("You are not authorized to delete this note");
            }
        }
        else
        {
            throw new Error("Note not found");
        }
    }

    async getAllNotes(userId : string)
    {
        const notes = await this.noteModel.find({user_id : new mongoose.Types.ObjectId(userId)});
        return notes;
    }
}
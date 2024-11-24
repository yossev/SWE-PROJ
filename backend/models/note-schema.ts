import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
const url = "mongodb://localhost:27017/"
mongoose.connect(url).then((ans) => { 
    console.log("Connecting SuccesFul!") 
  }).catch((err) => { 
    console.log("Error in the Connection") 
  })
@Schema()
export class Note {
    @Prop({ type: String , required : true , unique: true , minlength: 1})
    note_id : String;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    user_id: mongoose.Schema.Types.ObjectId; 

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Course' })
    course_id: mongoose.Schema.Types.ObjectId; 

    @Prop({ type: String , required : true , unique: true , minlength: 1})
    content: String;

    @Prop({ type: Date, default: Date.now, required: true})
    created_at: Date;

    @Prop({ type: Date, default: Date.now, required: true})
    last_at: Date;
}

export const NoteSchema = SchemaFactory.createForClass(Note);
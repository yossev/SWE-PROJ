const mongoose = require('mongoose');
const schemaOptions = {
  strict: false,
  timestamps: true,
};
const noteSchema = new mongoose.schema(
	{
		note_id : {
		  type: String,
		  min: 1,
		  required: true,
		},
		user_id : [{ type: Schema.Types.ObjectId, ref: 'User' , required: true}],
        course_id  : [{ type: Schema.Types.ObjectId, ref: 'User' }],
        content : {
            type: String,
            minLength: 1,
            required: true
        },
        created_at : {
            type: Date,
            default : Date.now,
            required: true
        },
        last_updated : {
            type: Date,
            default : Date.now,
            required: true
        }

	}
);

module.exports = mongoose.model("NoteModel" , noteSchema);
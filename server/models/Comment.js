import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    noteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Note', required: true },
    text: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Comment', commentSchema);

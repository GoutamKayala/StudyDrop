import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subject: { type: String, required: true },
    branch: {
        type: String,
        required: true,
        enum: ['CSE', 'CSD', 'ECE', 'EEE', 'MECH', 'CSM', 'IT', 'CIVIL', 'CHEMICAL']
    },
    college: { type: String, default: 'ANITS' },
    fileUrl: { type: String, required: true },
    storagePath: { type: String, required: true },
    uploaderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    uploaderRegNo: { type: String, required: true },
    downloadCount: { type: Number, default: 0 },
    ratings: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        value: { type: Number, min: 1, max: 5 }
    }],
    averageRating: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Note', noteSchema);

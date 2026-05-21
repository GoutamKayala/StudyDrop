import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    regNumber: { 
        type: String, 
        required: true, 
        unique: true,
        match: [/^[a-zA-Z0-9]+$/, 'Registration number must be alphanumeric']
    },
    branch: {
        type: String,
        required: true,
        enum: ['CSE', 'CSD', 'ECE', 'EEE', 'MECH', 'CSM', 'IT', 'CIVIL', 'CHEMICAL']
    },
    college: { type: String, default: 'ANITS' },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Note' }],
    recentlyViewed: [{
        noteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Note' },
        timestamp: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

export default mongoose.model('User', userSchema);

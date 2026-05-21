import Note from '../models/Note.js';
import Comment from '../models/Comment.js';
import User from '../models/User.js';

// @desc    Get notes filtered by college, branch, subject, search
export const getNotes = async (req, res) => {
    try {
        const { college, branch, subject, search, sortBy } = req.query;
        let query = {};

        if (college) query.college = college;
        if (branch) query.branch = branch;
        if (subject) query.subject = subject;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { subject: { $regex: search, $options: 'i' } }
            ];
        }

        let sortOption = { createdAt: -1 };
        if (sortBy === 'downloads') sortOption = { downloadCount: -1 };
        if (sortBy === 'ratings') sortOption = { averageRating: -1 };

        const notes = await Note.find(query)
            .select('-uploaderRegNo')
            .sort(sortOption);
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new note
export const createNote = async (req, res) => {
    try {
        const { title, subject, branch, college } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'PDF File is required' });
        }

        // Local upload logic
        const fs = await import('fs');
        const path = await import('path');

        const uploadDir = path.join(process.cwd(), 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Generate a unique filename
        const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}-${req.file.originalname}`;
        const filepath = path.join(uploadDir, filename);

        // Save the file to server disk
        fs.writeFileSync(filepath, req.file.buffer);

        // Construct the file serving URL
        const host = req.get('host') || 'localhost:5000';
        const protocol = req.protocol || 'http';
        const fileUrl = `${protocol}://${host}/uploads/${filename}`;
        const storagePath = `uploads/${filename}`;

        const note = await Note.create({
            title,
            subject,
            branch,
            college: college || 'ANITS',
            fileUrl,
            storagePath,
            uploaderId: req.user._id,
            uploaderRegNo: req.user.regNumber
        });

        // Remove sensitive fields before sending response
        const noteResponse = note.toObject();
        delete noteResponse.uploaderRegNo;

        res.status(201).json(noteResponse);
    } catch (error) {
        console.error("Error creating note:", error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Increment download count
export const incrementDownload = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (note) {
            note.downloadCount += 1;
            await note.save();
            res.json({ message: 'Download count incremented', count: note.downloadCount });
        } else {
            res.status(404).json({ message: 'Note not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Rate a note
export const rateNote = async (req, res) => {
    try {
        const { value } = req.body;
        const note = await Note.findById(req.params.id);

        if (note) {
            const existingRatingIndex = note.ratings.findIndex(r => r.userId.toString() === req.user._id.toString());

            if (existingRatingIndex >= 0) {
                note.ratings[existingRatingIndex].value = Number(value);
            } else {
                note.ratings.push({ userId: req.user._id, value: Number(value) });
            }

            const total = note.ratings.reduce((acc, item) => item.value + acc, 0);
            note.averageRating = total / note.ratings.length;

            await note.save();
            res.json(note);
        } else {
            res.status(404).json({ message: 'Note not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a note
export const deleteNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        // Authorization: Only the uploader or an admin can delete the note
        if (note.uploaderId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this note' });
        }

        // Delete file from local disk if it exists
        if (note.storagePath) {
            try {
                const fs = await import('fs');
                const path = await import('path');
                const filepath = path.join(process.cwd(), note.storagePath);
                if (fs.existsSync(filepath)) {
                    fs.unlinkSync(filepath);
                    console.log(`Deleted local file: ${filepath}`);
                }
            } catch (fileError) {
                console.error("Error deleting local file:", fileError);
            }
        }

        await note.deleteOne();
        await Comment.deleteMany({ noteId: req.params.id });
        res.status(200).json({ message: 'Note removed' });
    } catch (error) {
        console.error("Error deleting note:", error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add comment
export const addComment = async (req, res) => {
    try {
        const { text } = req.body;
        const comment = await Comment.create({
            noteId: req.params.id,
            text
        });
        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get comments for a note
export const getComments = async (req, res) => {
    try {
        const comments = await Comment.find({ noteId: req.params.id }).sort({ createdAt: -1 });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Track recently viewed
export const trackView = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            const exists = user.recentlyViewed.find(v => v.noteId.toString() === req.params.id);
            if (!exists) {
                user.recentlyViewed.unshift({ noteId: req.params.id, timestamp: Date.now() });
                if (user.recentlyViewed.length > 20) {
                    user.recentlyViewed.pop(); // Keep only last 20
                }
                await user.save();
            }
            res.json({ message: 'View tracked' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Bookmark note
export const toggleBookmark = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            const index = user.bookmarks.indexOf(req.params.id);
            if (index > -1) {
                user.bookmarks.splice(index, 1);
            } else {
                user.bookmarks.push(req.params.id);
            }
            await user.save();
            res.json(user.bookmarks);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

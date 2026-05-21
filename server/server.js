import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import authRoutes from './routes/authRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import userRoutes from './routes/userRoutes.js';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/users', userRoutes);
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));



app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'StudyDrop API is running' });
});

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/studydrop';

mongoose.connect(MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');
        
        try {
            const adminExists = await User.findOne({ regNumber: '00000000' });
            if (!adminExists) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash('admin123', salt);
                await User.create({
                    name: 'System Admin',
                    regNumber: '00000000',
                    branch: 'CSE',
                    college: 'ANITS',
                    password: hashedPassword,
                    role: 'admin'
                });
                console.log('Admin user seeded successfully');
            }
        } catch (error) {
            console.error('Error seeding admin user:', error);
        }

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });

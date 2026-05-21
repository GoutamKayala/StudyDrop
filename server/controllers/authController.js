import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export const register = async (req, res) => {
    try {
        const { name, regNumber, branch, college, password } = req.body;

        const userExists = await User.findOne({ regNumber });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            regNumber,
            branch,
            college: college || 'ANITS',
            password: hashedPassword
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            regNumber: user.regNumber,
            role: user.role,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { regNumber, password } = req.body;

        const user = await User.findOne({ regNumber });
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                name: user.name,
                regNumber: user.regNumber,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid registration number or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

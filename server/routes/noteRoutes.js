import express from 'express';
import {
    getNotes,
    createNote,
    incrementDownload,
    rateNote,
    deleteNote,
    addComment,
    getComments,
    trackView,
    toggleBookmark
} from '../controllers/noteController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getNotes)
    .post(protect, upload.single('pdfFile'), createNote);

router.route('/:id/download')
    .post(protect, incrementDownload);

router.route('/:id/rate')
    .post(protect, rateNote);

router.route('/:id')
    .delete(protect, deleteNote);

router.route('/:id/comments')
    .get(protect, getComments)
    .post(protect, addComment);

router.route('/:id/view')
    .post(protect, trackView);

router.route('/:id/bookmark')
    .post(protect, toggleBookmark);

export default router;

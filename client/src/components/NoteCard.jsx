import React, { useState, useContext } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { Download, Star, Trash2, Eye } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const NoteCard = ({ note, onDelete }) => {
    const { user } = useContext(AuthContext);
    const [downloads, setDownloads] = useState(note?.downloadCount || 0);
    const [avgRating, setAvgRating] = useState(note?.averageRating || 0);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isRating, setIsRating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [showConfirm, setShowConfirm] = useState(false);

    const handleDownload = async () => {
        if (isDownloading) return;
        setIsDownloading(true);
        try {
            // Fetch the PDF file as a blob to force direct system download
            const response = await axios.get(note.fileUrl, {
                responseType: 'blob',
            });
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            // Clean title to use as filename
            const cleanTitle = note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            link.setAttribute('download', `${cleanTitle}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            // Then hit the API to increment download count
            const { data } = await axios.post(`http://localhost:5000/api/notes/${note._id}/download`, {}, {
                headers: { Authorization: `Bearer ${user?.token}` }
            });
            setDownloads(data.count);
        } catch (error) {
            console.error('Download failed, falling back to new tab:', error);
            window.open(note.fileUrl, '_blank');
        } finally {
            setIsDownloading(false);
        }
    };

    const handleRate = async (value) => {
        if (isRating) return;
        setIsRating(true);
        try {
            const { data } = await axios.post(`http://localhost:5000/api/notes/${note._id}/rate`, { value }, {
                headers: { Authorization: `Bearer ${user?.token}` }
            });
            setAvgRating(data.averageRating);
        } catch (error) {
            console.error('Rating failed:', error);
        } finally {
            setIsRating(false);
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await axios.delete(`http://localhost:5000/api/notes/${note._id}`, {
                headers: { Authorization: `Bearer ${user?.token}` }
            });
            if (onDelete) onDelete(note._id);
        } catch (error) {
            console.error('Delete failed:', error);
            alert('Failed to delete note. Ensure you have permissions.');
        } finally {
            setIsDeleting(false);
        }
    };

    const canDelete = user?.role === 'admin' || user?._id === note.uploaderId;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group">
            {canDelete && (
                <button 
                    onClick={() => setShowConfirm(true)}
                    disabled={isDeleting}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all disabled:opacity-50"
                    title="Delete Note"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
            )}

            {/* Custom confirmation popup */}
            {showConfirm && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 transform scale-100 transition-all duration-300">
                        <h4 className="text-lg font-bold text-gray-900 mb-2">Delete Academic Note</h4>
                        <p className="text-sm text-gray-500 mb-6">
                            Are you sure you want to permanently delete <strong className="text-gray-700">"{note.title}"</strong>? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="px-4 py-2 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    setShowConfirm(false);
                                    handleDelete();
                                }}
                                className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors"
                            >
                                Delete Permanently
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
            <h3 className="text-xl font-bold text-gray-900 line-clamp-1 pr-8">{note.title}</h3>
            <p className="text-sm text-blue-600 font-semibold mt-1">{note.subject}</p>
            <p className="text-xs text-gray-500 mt-2 font-medium bg-gray-50 inline-block px-2 py-1 rounded-md">
                Branch: {note.branch}
            </p>

            <div className="mt-5 flex items-center justify-between">
                <div className="flex gap-4">
                    <span className="flex items-center text-xs text-gray-600 gap-1 font-medium bg-blue-50 px-2 py-1 rounded-md">
                        <Download className="w-3.5 h-3.5 text-blue-500" /> {downloads}
                    </span>
                    <div className="flex items-center text-xs text-gray-600 gap-1 font-medium bg-yellow-50 px-2 py-1 rounded-md group relative">
                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" /> {typeof avgRating === 'number' ? avgRating.toFixed(1) : "0.0"}
                        
                        {/* Rating Popover */}
                        <div className="absolute bottom-full left-0 mb-2 hidden group-hover:flex bg-white shadow-xl rounded-lg p-2 border border-gray-100 z-10 gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                    key={star}
                                    className="w-5 h-5 text-gray-300 hover:text-yellow-400 hover:fill-yellow-400 cursor-pointer transition-colors"
                                    onClick={() => handleRate(star)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                
                <div className="flex gap-2">
                    <button
                        onClick={() => window.open(note.fileUrl, '_blank')}
                        className="px-3 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1"
                    >
                        <Eye className="w-4 h-4" /> View
                    </button>
                    <button
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 flex items-center gap-1"
                    >
                        <Download className="w-4 h-4" /> Download
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NoteCard;

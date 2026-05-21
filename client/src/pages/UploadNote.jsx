import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const UploadNote = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        subject: '',
        branch: user?.branch || '',
    });
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const branches = ['CSE', 'CSD', 'ECE', 'EEE', 'MECH', 'CSM', 'IT', 'CIVIL', 'CHEMICAL'];

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            return setError('Please select a PDF file to upload.');
        }

        setLoading(true);
        try {
            const formDataUpload = new FormData();
            formDataUpload.append('title', formData.title);
            formDataUpload.append('subject', formData.subject);
            formDataUpload.append('branch', formData.branch);
            formDataUpload.append('pdfFile', file);

            await axios.post('http://localhost:5000/api/notes', formDataUpload, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Upload failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Academic Note</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {error && <p className="text-red-500 text-sm">{error}</p>}

                <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input type="text" required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                        value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Subject</label>
                    <input type="text" required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                        value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Branch</label>
                    <select
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                        value={formData.branch} onChange={e => setFormData({ ...formData, branch: e.target.value })} required
                    >
                        <option value="" disabled hidden>Select Branch</option>
                        {branches.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">PDF File</label>
                    <input type="file" accept="application/pdf" required
                        className="mt-1 block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                        onChange={e => setFile(e.target.files[0])}
                    />
                </div>

                <button
                    type="submit" disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                >
                    {loading ? 'Uploading...' : 'Publish Note'}
                </button>
            </form>
        </div>
    );
};

export default UploadNote;

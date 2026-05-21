import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Filter } from 'lucide-react';
import NoteCard from '../components/NoteCard';

const Home = ({ selectedBranch }) => {
    const [notes, setNotes] = useState([]);
    const [search, setSearch] = useState('');
    const { user } = useContext(AuthContext);

    useEffect(() => {
        fetchNotes();
    }, [selectedBranch, search]);

    const fetchNotes = async () => {
        try {
            const token = user?.token;
            let url = `http://localhost:5000/api/notes?`;
            if (selectedBranch) url += `branch=${selectedBranch}&`;
            if (search) url += `search=${search}&`;

            const { data } = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotes(data || []);
        } catch (error) {
            console.error('Failed to fetch notes', error);
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">
                    {selectedBranch ? `${selectedBranch} Notes` : 'All Notes'}
                </h1>
                <div className="flex gap-4 w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search title..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="px-4 py-2 border rounded-md w-full md:w-64 focus:ring-primary focus:border-primary"
                    />
                    <Link to="/upload" className="px-4 py-2 bg-primary text-white rounded-md whitespace-nowrap hover:bg-secondary">
                        Upload Notes
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {notes.map(note => (
                    <NoteCard 
                        key={note._id} 
                        note={note} 
                        onDelete={(deletedId) => setNotes(notes.filter(n => n._id !== deletedId))} 
                    />
                ))}

                {notes.length === 0 && (
                    <div className="col-span-full py-12 text-center text-gray-500">
                        <p>No notes found for this category or search.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;

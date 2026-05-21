import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const CollegeSelection = () => {
    const [selected, setSelected] = useState('');
    const { setCollege } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleContinue = () => {
        if (!selected) return;
        setCollege(selected);
        navigate('/login');
    };

    return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50 px-4">
            <h1 className="text-5xl md:text-6xl font-black text-blue-600 tracking-tighter text-center mb-10 drop-shadow-sm">
                StudyDrop
            </h1>

            <div className="w-full max-w-md">
                <select
                    id="college"
                    value={selected}
                    onChange={(e) => setSelected(e.target.value)}
                    className="block w-full px-4 py-3 text-lg font-medium border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-xl border appearance-none text-center bg-white cursor-pointer transition-all hover:border-blue-400 hover:shadow-lg"
                    style={{ textAlignLast: 'center' }}
                >
                    <option value="" disabled hidden>Select Your College</option>
                    <option value="ANITS">ANITS</option>
                </select>

                <button
                    onClick={handleContinue}
                    disabled={!selected}
                    className={`mt-6 w-full flex justify-center py-3 px-4 rounded-xl shadow-md text-lg font-bold text-white transition-all transform ${selected ? 'bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-lg focus:ring-2 focus:ring-offset-2 focus:ring-blue-500' : 'bg-blue-300 cursor-not-allowed'}`}
                >
                    Continue
                </button>
            </div>
        </div>
    );
};

export default CollegeSelection;

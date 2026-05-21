import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        regNumber: '',
        branch: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const { register, user, college } = useContext(AuthContext);
    const navigate = useNavigate();

    const branches = ['CSE', 'CSD', 'ECE', 'EEE', 'MECH', 'CSM', 'IT', 'CIVIL', 'CHEMICAL'];

    useEffect(() => {
        if (!college) navigate('/welcome');
        if (user) navigate('/');
    }, [user, college, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }
        try {
            await register({ ...formData, college });
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create an account</h2>
                </div>
                <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                    {error && <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">{error}</div>}

                    <input type="text" required placeholder="Full Name" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary sm:text-sm"
                        value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />

                    <input type="text" required placeholder="Registration Number" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary sm:text-sm"
                        value={formData.regNumber} onChange={e => setFormData({ ...formData, regNumber: e.target.value })} />

                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary sm:text-sm"
                        value={formData.branch} onChange={e => setFormData({ ...formData, branch: e.target.value })} required>
                        <option value="" disabled hidden>Select Branch</option>
                        {branches.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>

                    <input type="text" disabled value={college || ''} className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md text-gray-500 sm:text-sm" />

                    <input type="password" required placeholder="Password" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary sm:text-sm"
                        value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />

                    <input type="password" required placeholder="Confirm Password" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary sm:text-sm"
                        value={formData.confirmPassword} onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })} />

                    <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                        Register
                    </button>
                </form>
                <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                        Already have an account? <Link to="/login" className="font-medium text-primary hover:text-secondary">Log in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;

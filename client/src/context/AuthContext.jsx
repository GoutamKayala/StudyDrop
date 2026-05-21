import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [college, setCollege] = useState(() => {
        return localStorage.getItem('college') || '';
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    useEffect(() => {
        if (college) {
            localStorage.setItem('college', college);
        } else {
            localStorage.removeItem('college');
        }
    }, [college]);

    const login = async (regNumber, password) => {
        const { data } = await axios.post('http://localhost:5000/api/auth/login', { regNumber, password });
        setUser(data);
    };

    const register = async (userData) => {
        const { data } = await axios.post('http://localhost:5000/api/auth/register', userData);
        setUser(data);
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, college, setCollege, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

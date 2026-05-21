import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Menu, LogOut, User as UserIcon } from 'lucide-react';

const Navbar = ({ toggleSidebar }) => {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center gap-4">
                        {user && (
                            <button onClick={toggleSidebar} className="p-2 rounded-md hover:bg-gray-100 focus:outline-none md:hidden">
                                <Menu className="h-6 w-6 text-gray-600" />
                            </button>
                        )}
                        <Link to="/" className="text-2xl font-bold tracking-tight text-primary">
                            StudyDrop
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                                    {user.name} {user.branch ? `(${user.branch})` : ''}
                                </span>
                                <button
                                    onClick={logout}
                                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                    title="Logout"
                                >
                                    <LogOut className="h-5 w-5" />
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-secondary transition-colors">
                                <UserIcon className="h-4 w-4" /> Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

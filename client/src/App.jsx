import React, { useState, useEffect, useContext } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import CollegeSelection from './pages/CollegeSelection';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import UploadNote from './pages/UploadNote';

const AppLayout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
      <div className="flex flex-1">
        <Sidebar isOpen={isSidebarOpen} selectedBranch={selectedBranch} setSelectedBranch={setSelectedBranch} />
        <main className="flex-1 p-6 md:ml-64 transition-all duration-300">
          {React.cloneElement(children, { selectedBranch })}
        </main>
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const { user, college } = useContext(AuthContext);
  if (!college) return <Navigate to="/welcome" />;
  if (!user) return <Navigate to="/welcome" />;
  return <AppLayout>{children}</AppLayout>;
};

function App() {
  const { user, college } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && window.location.pathname === '/') {
      navigate('/welcome');
    } else if (!college && window.location.pathname !== '/welcome') {
      navigate('/welcome');
    }
  }, [user, college, navigate]);

  return (
    <Routes>
      <Route path="/welcome" element={<CollegeSelection />} />
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />

      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/upload" element={<ProtectedRoute><UploadNote /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;

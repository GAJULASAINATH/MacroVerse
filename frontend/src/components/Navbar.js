import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Navbar = () => {
  const { logout, token } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCredits();
  }, []);

  const fetchCredits = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/pricing/addCredits`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // Since the endpoint doesn't return credits directly, we'll handle it differently
      setCredits(0); // We'll update this when we implement proper credit fetching
    } catch (error) {
      console.error('Error fetching credits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white/10 backdrop-blur-md border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="text-white text-2xl font-bold">
              MACROVERSE
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link
                to="/dashboard"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/dashboard')
                    ? 'bg-white/20 text-white'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/analyze"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/analyze')
                    ? 'bg-white/20 text-white'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                Analyze Food
              </Link>
              <Link
                to="/report"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/report')
                    ? 'bg-white/20 text-white'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                Monthly Report
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/credits"
              className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors font-medium"
            >
              Credits: {loading ? '...' : credits}
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

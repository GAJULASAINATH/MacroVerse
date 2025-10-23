import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState({
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFats: 0,
    daysLogged: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMonthlyStats();
  }, []);

  const fetchMonthlyStats = async () => {
    try {
      const currentMonth = new Date().getMonth();
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/main-core/getMonthlyReport?month=${currentMonth}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Since the endpoint returns a PDF, we might not get stats directly
      // For now, we'll keep default values
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-white/80">Track your nutrition journey</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/analyze"
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all transform hover:scale-105"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Analyze Food</h3>
            <p className="text-white/70">Upload a photo to get instant nutrition analysis</p>
          </Link>

          <Link
            to="/report"
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all transform hover:scale-105"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Monthly Report</h3>
            <p className="text-white/70">Download detailed health insights and charts</p>
          </Link>

          <Link
            to="/credits"
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all transform hover:scale-105"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Manage Credits</h3>
            <p className="text-white/70">Purchase credits for more analyses</p>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <h3 className="text-white/80 text-sm font-medium mb-2">Total Calories</h3>
            <p className="text-3xl font-bold text-white">{loading ? '...' : stats.totalCalories}</p>
            <p className="text-white/60 text-sm mt-2">This month</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <h3 className="text-white/80 text-sm font-medium mb-2">Protein</h3>
            <p className="text-3xl font-bold text-white">{loading ? '...' : stats.totalProtein}g</p>
            <p className="text-white/60 text-sm mt-2">This month</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <h3 className="text-white/80 text-sm font-medium mb-2">Carbs</h3>
            <p className="text-3xl font-bold text-white">{loading ? '...' : stats.totalCarbs}g</p>
            <p className="text-white/60 text-sm mt-2">This month</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <h3 className="text-white/80 text-sm font-medium mb-2">Fats</h3>
            <p className="text-3xl font-bold text-white">{loading ? '...' : stats.totalFats}g</p>
            <p className="text-white/60 text-sm mt-2">This month</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

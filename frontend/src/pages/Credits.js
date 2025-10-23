import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Credits = () => {
  const { token } = useAuth();
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCredits();
  }, []);

  const fetchCredits = async () => {
    try {
      // Since we don't have a direct endpoint to get credits, 
      // we'll track it locally or you can implement a GET endpoint
      setCredits(0);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching credits:', err);
      setLoading(false);
    }
  };

  const handleAddCredits = async () => {
    setActionLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/pricing/addCredits?action=add`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setMessage(response.data.message);
      setCredits(response.data.credits);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add credits');
      console.error('Add credits error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const pricingPlans = [
    {
      name: 'Starter Pack',
      credits: 5,
      price: '$4.99',
      description: 'Perfect for trying out the service',
      features: ['5 food analyses', 'Basic nutrition data', 'Monthly reports']
    },
    {
      name: 'Standard Pack',
      credits: 15,
      price: '$12.99',
      description: 'Great for regular users',
      features: ['15 food analyses', 'Detailed nutrition data', 'Monthly reports', 'Priority support'],
      popular: true
    },
    {
      name: 'Premium Pack',
      credits: 30,
      price: '$24.99',
      description: 'Best value for power users',
      features: ['30 food analyses', 'Detailed nutrition data', 'Monthly reports', 'Priority support', 'Custom meal plans']
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Credits Management</h1>
          <p className="text-white/80">Purchase credits to analyze more food items</p>
        </div>

        {/* Current Credits */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8 mb-8">
          <div className="text-center">
            <h2 className="text-white/80 text-lg mb-2">Your Current Credits</h2>
            <p className="text-6xl font-bold text-white mb-4">
              {loading ? '...' : credits}
            </p>
            <p className="text-white/60">Each food analysis costs 5 credits</p>
          </div>
        </div>

        {message && (
          <div className="bg-green-500/20 border border-green-500 text-white px-4 py-3 rounded-lg mb-6">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-white px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white/10 backdrop-blur-md border rounded-xl p-8 relative ${
                plan.popular ? 'border-yellow-400 border-2' : 'border-white/20'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-yellow-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-white/70 text-sm mb-4">{plan.description}</p>
                <div className="mb-2">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                </div>
                <p className="text-white/60">{plan.credits} Credits</p>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start text-white/80">
                    <svg className="w-5 h-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={handleAddCredits}
                disabled={actionLoading}
                className={`w-full py-3 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
                  plan.popular
                    ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {actionLoading ? 'Processing...' : 'Purchase'}
              </button>
            </div>
          ))}
        </div>

        {/* How Credits Work */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">How Credits Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                <span className="text-white font-bold">1</span>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">Purchase Credits</h3>
                <p className="text-white/70">Choose a plan and purchase credits securely</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                <span className="text-white font-bold">2</span>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">Analyze Food</h3>
                <p className="text-white/70">Each food analysis costs 5 credits</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                <span className="text-white font-bold">3</span>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">Get Insights</h3>
                <p className="text-white/70">Receive detailed nutrition information instantly</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                <span className="text-white font-bold">4</span>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">Track Progress</h3>
                <p className="text-white/70">View monthly reports and track your nutrition journey</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Credits;

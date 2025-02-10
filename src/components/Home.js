import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Call backend logout endpoint
      await fetch(`${process.env.REACT_APP_API_URL}api/logout`, {
        credentials: 'include'
      });
      
      // Clear local auth state
      logout();
      
      // Redirect to login
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              {user?.profilePhoto && (
                <img 
                  src={user.profilePhoto} 
                  alt="Profile" 
                  className="h-12 w-12 rounded-full"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold">Welcome, {user?.displayName}</h1>
                <p className="text-gray-600">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Logout
            </button>
          </div>
          {/* Add your home page content here */}
        </div>
      </div>
    </div>
  );
}

export default Home;
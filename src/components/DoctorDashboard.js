// src/components/DoctorDashboard.js
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function DoctorDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <span className="text-xl font-bold text-indigo-600">MediConnect</span>
                        </div>
                        <div className="flex items-center">
                            <span className="mr-4 text-gray-700">Dr. {user?.firstName}</span>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Doctor Dashboard</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Appointments</h2>
                        <p className="text-gray-600">No appointments scheduled</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Patient Records</h2>
                        <p className="text-gray-600">No recent patient records</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
                        <div className="space-y-2">
                            <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded">
                                View Schedule
                            </button>
                            <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded">
                                Add Patient
                            </button>
                            <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded">
                                Update Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DoctorDashboard;
// components/RoleSelection.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    Stethoscope, 
    User, 
    ChevronRight, 
    Activity,
    Calendar,
    ClipboardList,
    Shield,
    ArrowLeft,
    Loader
} from 'lucide-react';

function RoleSelection() {
    const { updateRole, logout } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

 // In RoleSelection.jsx, update handleRoleSelect
const handleRoleSelect = async (role) => {
    try {
        setLoading(true);
        setError('');
        const result = await updateRole(role);
        if (result.success) {
            if (role === 'doctor') {
                navigate('/doctor/register');
            } else if (role === 'patient') {
                navigate('/patient/register');
            }
        } else {
            setError('Failed to update role');
        }
    } catch (error) {
        console.error('Error updating role:', error);
        setError('An error occurred');
    } finally {
        setLoading(false);
    }
};
    const handleBack = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                <div className="flex flex-col items-center">
                    <Loader className="h-8 w-8 text-indigo-600 animate-spin" />
                    <p className="mt-2 text-gray-600">Updating role...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            {/* Navigation Bar */}
            <nav className="bg-white/80 backdrop-blur-md shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20">
                        <div className="flex items-center space-x-4">
                            {/* Back Button */}
                            <button
                                onClick={handleBack}
                                className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
                            >
                                <ArrowLeft className="h-5 w-5 mr-2" />
                                Back to Login
                            </button>

                            <div className="h-6 w-px bg-gray-200"></div>

                            {/* Logo */}
                            <div className="relative">
                                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-30"></div>
                                <div className="relative bg-white rounded-full p-2">
                                    <svg className="h-10 w-10" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M25 10C25 7.23858 27.2386 5 30 5H35C37.7614 5 40 7.23858 40 10V15C40 17.7614 37.7614 20 35 20H30C27.2386 20 25 17.7614 25 15V10Z" fill="#4F46E5"/>
                                        <path d="M32.5 20V35C32.5 41.6274 27.1274 47 20.5 47C13.8726 47 8.5 41.6274 8.5 35C8.5 28.3726 13.8726 23 20.5 23" stroke="#4F46E5" strokeWidth="3" strokeLinecap="round"/>
                                        <circle cx="32.5" cy="12.5" r="2.5" fill="white"/>
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    MediConnect
                                </span>
                                <span className="block text-xs text-gray-500">Healthcare Excellence</span>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Error Message */}
            {error && (
                <div className="max-w-4xl mx-auto mt-4 px-4">
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
                        <span className="block sm:inline">{error}</span>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] px-4 py-12">
                <div className="max-w-4xl w-full">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                            Choose Your Role
                        </h1>
                        <p className="text-gray-600">Select how you would like to use MediConnect</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Doctor Card */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                            <button
                                onClick={() => handleRoleSelect('doctor')}
                                disabled={loading}
                                className="relative w-full bg-white rounded-2xl p-6 shadow-xl transition-all duration-200 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <div className="absolute top-6 right-6 text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ChevronRight className="h-6 w-6" />
                                </div>
                                
                                <div className="flex flex-col items-center text-center">
                                    <div className="relative mb-6">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-30"></div>
                                        <div className="relative bg-white rounded-full p-4 shadow-lg">
                                            <Stethoscope className="h-12 w-12 text-indigo-600" />
                                        </div>
                                    </div>
                                    
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Join as a Doctor</h2>
                                    <p className="text-gray-600 mb-6">Provide care to patients and manage your practice efficiently</p>
                                    
                                    <div className="grid grid-cols-2 gap-4 text-left">
                                        <div className="flex items-center space-x-2">
                                            <Calendar className="h-5 w-5 text-indigo-600" />
                                            <span className="text-sm text-gray-600">Manage Schedule</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <ClipboardList className="h-5 w-5 text-indigo-600" />
                                            <span className="text-sm text-gray-600">Patient Records</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Activity className="h-5 w-5 text-indigo-600" />
                                            <span className="text-sm text-gray-600">Track Progress</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Shield className="h-5 w-5 text-indigo-600" />
                                            <span className="text-sm text-gray-600">Secure Platform</span>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        </div>

                        {/* Patient Card */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                            <button
                                onClick={() => handleRoleSelect('patient')}
                                disabled={loading}
                                className="relative w-full bg-white rounded-2xl p-6 shadow-xl transition-all duration-200 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <div className="absolute top-6 right-6 text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ChevronRight className="h-6 w-6" />
                                </div>
                                
                                <div className="flex flex-col items-center text-center">
                                    <div className="relative mb-6">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-30"></div>
                                        <div className="relative bg-white rounded-full p-4 shadow-lg">
                                            <User className="h-12 w-12 text-indigo-600" />
                                        </div>
                                    </div>
                                    
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Join as a Patient</h2>
                                    <p className="text-gray-600 mb-6">Access quality healthcare and manage your medical journey</p>
                                    
                                    <div className="grid grid-cols-2 gap-4 text-left">
                                        <div className="flex items-center space-x-2">
                                            <Calendar className="h-5 w-5 text-indigo-600" />
                                            <span className="text-sm text-gray-600">Book Appointments</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <ClipboardList className="h-5 w-5 text-indigo-600" />
                                            <span className="text-sm text-gray-600">Medical History</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Activity className="h-5 w-5 text-indigo-600" />
                                            <span className="text-sm text-gray-600">Health Tracking</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Shield className="h-5 w-5 text-indigo-600" />
                                            <span className="text-sm text-gray-600">Data Privacy</span>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RoleSelection;
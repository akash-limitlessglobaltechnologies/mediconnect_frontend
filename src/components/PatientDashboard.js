// components/PatientDashboard.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Calendar, FileText, Settings, LogOut } from 'lucide-react';

function PatientDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [patientData, setPatientData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPatientData();
    }, []);

    const fetchPatientData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5001/api/patient/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (data.success) {
                setPatientData(data.data);
            } else {
                setError(data.message);
            }
        } catch (error) {
            setError('Error fetching patient data');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation Bar */}
            <nav className="bg-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <span className="text-2xl font-bold text-indigo-600">MediConnect</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-700">{user?.name}</span>
                            <button
                                onClick={handleLogout}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Profile Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-6 rounded-lg shadow-md"
                    >
                        <div className="flex items-center mb-4">
                            <User className="h-5 w-5 text-indigo-600 mr-2" />
                            <h2 className="text-xl font-semibold text-gray-800">Profile</h2>
                        </div>
                        {patientData ? (
                            <div className="space-y-3">
                                <p className="text-gray-600">Name: {patientData.fullName}</p>
                                <p className="text-gray-600">DOB: {new Date(patientData.dateOfBirth).toLocaleDateString()}</p>
                                <p className="text-gray-600">Blood Group: {patientData.bloodGroup}</p>
                                <p className="text-gray-600">Gender: {patientData.gender}</p>
                            </div>
                        ) : (
                            <p className="text-gray-600">Complete your profile to see information here.</p>
                        )}
                    </motion.div>

                    {/* Appointments Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white p-6 rounded-lg shadow-md"
                    >
                        <div className="flex items-center mb-4">
                            <Calendar className="h-5 w-5 text-indigo-600 mr-2" />
                            <h2 className="text-xl font-semibold text-gray-800">Appointments</h2>
                        </div>
                        <p className="text-gray-600">No upcoming appointments</p>
                        <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors">
                            Book Appointment
                        </button>
                    </motion.div>

                    {/* Medical Records Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white p-6 rounded-lg shadow-md"
                    >
                        <div className="flex items-center mb-4">
                            <FileText className="h-5 w-5 text-indigo-600 mr-2" />
                            <h2 className="text-xl font-semibold text-gray-800">Medical Records</h2>
                        </div>
                        <p className="text-gray-600">No medical records available</p>
                        <button className="mt-4 px-4 py-2 text-indigo-600 hover:text-indigo-700 transition-colors">
                            View All Records
                        </button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

export default PatientDashboard;
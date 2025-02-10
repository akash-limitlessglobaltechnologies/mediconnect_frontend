import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    User, Calendar, Clock, Search, AlertCircle, 
    FileText, ChevronRight, Heart, LogOut 
} from 'lucide-react';

const PatientDashboard = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [dashboardData, setDashboardData] = useState({
        profile: null,
        appointments: [],
        recentAppointments: [],
        loading: true,
        error: null
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            };
    
            const [profileRes, appointmentsRes] = await Promise.all([
                fetch(`${process.env.REACT_APP_API_URL}api/patient/profile`, {
                    headers
                }),
                fetch(`${process.env.REACT_APP_API_URL}api/doctor/patient/appointments?limit=5`, {
                    headers
                })
            ]);
    
            if (!profileRes.ok || !appointmentsRes.ok) {
                throw new Error('Failed to fetch dashboard data');
            }
    
            const [profileData, appointmentsData] = await Promise.all([
                profileRes.json(),
                appointmentsRes.json()
            ]);
    
            console.log('Profile Data:', profileData); // Debug log
            console.log('Appointments Data:', appointmentsData); // Debug log
    
            if (profileData.success && appointmentsData.success) {
                setDashboardData({
                    profile: profileData.data,
                    appointments: appointmentsData.data.appointments || [],
                    recentAppointments: (appointmentsData.data.appointments || []).slice(0, 3),
                    loading: false,
                    error: null
                });
            } else {
                throw new Error(profileData.message || appointmentsData.message || 'Failed to load data');
            }
        } catch (error) {
            console.error('Dashboard error:', error);
            setDashboardData(prev => ({
                ...prev,
                loading: false,
                error: error.message || 'Failed to load dashboard data'
            }));
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    if (dashboardData.loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    const { profile, appointments, recentAppointments, error } = dashboardData;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-indigo-600">
                            MediConnect
                        </span>
                        <div className="flex items-center space-x-4">
                            <button 
                                onClick={() => navigate('/patient/profile')}
                                className="flex items-center text-gray-700 hover:text-indigo-600"
                            >
                                <User className="h-5 w-5 mr-2" />
                                {profile?.fullName}
                            </button>
                            <button
                                onClick={handleLogout}
                                className="text-gray-500 hover:text-red-600"
                            >
                                <LogOut className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {error && (
                    <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-lg flex items-center">
                        <AlertCircle className="h-5 w-5 mr-2" />
                        {error}
                    </div>
                )}

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div onClick={() => navigate('/patient/search-doctors')} 
                         className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md cursor-pointer">
                        <Search className="h-8 w-8 text-indigo-600 mb-3" />
                        <h3 className="text-lg font-semibold">Find Doctor</h3>
                        <p className="text-gray-600">Search and book appointments</p>
                    </div>

                    <div onClick={() => navigate('/patient/appointments')}
                         className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md cursor-pointer">
                        <Calendar className="h-8 w-8 text-indigo-600 mb-3" />
                        <h3 className="text-lg font-semibold">My Appointments</h3>
                        <p className="text-gray-600">{appointments.length} upcoming</p>
                    </div>

                    <div onClick={() => navigate('/patient/records')}
                         className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md cursor-pointer">
                        <FileText className="h-8 w-8 text-indigo-600 mb-3" />
                        <h3 className="text-lg font-semibold">Medical Records</h3>
                        <p className="text-gray-600">View your health records</p>
                    </div>
                </div>

                {/* Upcoming Appointments and Profile Summary */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold">Upcoming Appointments</h2>
                                <button 
                                    onClick={() => navigate('/patient/appointments')}
                                    className="text-indigo-600 hover:text-indigo-700 flex items-center"
                                >
                                    View All
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                {recentAppointments.map(appointment => (
                                    <div key={appointment._id} 
                                         className="border-b last:border-0 pb-4 last:pb-0">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-medium">
                                                    Dr. {appointment.doctorId?.personalInfo?.fullName}
                                                </h3>
                                                <div className="flex items-center mt-2 text-sm text-gray-600">
                                                    <Calendar className="w-4 h-4 mr-2" />
                                                    {new Date(appointment.appointmentDate).toLocaleDateString()}
                                                    <Clock className="w-4 h-4 ml-4 mr-2" />
                                                    {appointment.timeSlot.startTime}
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-sm ${
                                                appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                                                appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {appointment.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {recentAppointments.length === 0 && (
                                    <p className="text-gray-500 text-center py-4">
                                        No upcoming appointments
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-semibold mb-6">Profile Summary</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-gray-500 text-sm">Blood Group</label>
                                <p className="font-medium">{profile?.bloodGroup || 'Not set'}</p>
                            </div>
                            <div>
                                <label className="text-gray-500 text-sm">Age</label>
                                <p className="font-medium">
                                    {profile?.dateOfBirth ? 
                                        new Date().getFullYear() - new Date(profile.dateOfBirth).getFullYear() 
                                        : 'Not set'} years
                                </p>
                            </div>
                            <div>
                                <label className="text-gray-500 text-sm">Emergency Contact</label>
                                <p className="font-medium">
                                    {profile?.emergencyContact?.name || 'Not set'}
                                </p>
                            </div>
                            <button
                                onClick={() => navigate('/patient/profile')}
                                className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
                            >
                                Update Profile
                            </button>
                        </div>
                    </div>
                </div>

                {/* Health Metrics */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">Health Overview</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <Heart className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
                            <h3 className="font-medium">Recent Visits</h3>
                            <p className="text-2xl font-bold text-indigo-600 mt-2">
                                {appointments.length}
                            </p>
                        </div>
                        {/* Add more health metrics as needed */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;
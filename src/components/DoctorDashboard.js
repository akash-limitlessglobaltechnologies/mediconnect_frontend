// src/components/doctor/DoctorDashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    UserCircle, Calendar, Clock, Users, 
    IndianRupee, Settings, ChevronRight, 
    LogOut, Phone, Mail
} from 'lucide-react';

const StatsCard = ({ title, value, icon: Icon, bgColor, textColor }) => (
    <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center">
            <div className={`${bgColor} rounded-full p-3`}>
                <Icon className={`h-6 w-6 ${textColor}`} />
            </div>
            <div className="ml-4">
                <p className="text-sm text-gray-600">{title}</p>
                <p className="text-xl font-semibold mt-1">{value}</p>
            </div>
        </div>
    </div>
);

const AppointmentCard = ({ appointment }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-start">
            <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <UserCircle className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-3">
                    <p className="font-medium text-gray-900">
                        {appointment.patientName || 'Patient Name'}
                    </p>
                    <p className="text-sm text-gray-500">{appointment.type}</p>
                </div>
            </div>
            <span className={`px-2 py-1 text-xs rounded-full ${
                appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
            }`}>
                {appointment.status}
            </span>
        </div>
        <div className="mt-4 flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-2" />
            {appointment.time}
        </div>
    </div>
);

function DoctorDashboard() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [stats, setStats] = useState({
        totalPatients: 0,
        todayAppointments: 0,
        totalEarnings: 0,
        upcomingAppointments: 0
    });
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        fetchDashboardData();
    }, [navigate]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('token');
            
            // Fetch stats
           const statsResponse = await fetch(`${process.env.REACT_APP_API_URL}api/doctor/stats`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // Fetch today's appointments
            const appointmentsResponse = await fetch(`${process.env.REACT_APP_API_URL}api/doctor/appointments/today`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const statsData = await statsResponse.json();
            const appointmentsData = await appointmentsResponse.json();

            if (statsData.success) {
                setStats(statsData.data);
            }

            if (appointmentsData.success) {
                setAppointments(appointmentsData.data);
            }

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setError('Failed to load dashboard data');
            // Use mock data for development
            setStats({
                totalPatients: 150,
                todayAppointments: 8,
                totalEarnings: 25000,
                upcomingAppointments: 15
            });
            setAppointments([
                {
                    _id: 1,
                    patientName: "John Doe",
                    time: "10:00 AM",
                    type: "Check-up",
                    status: "scheduled"
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const handleProfileClick = () => {
        navigate('/doctor/profile');
    };

    const handleAppointmentsClick = () => {
        navigate('/doctor/appointments');
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
            {/* Top Navigation */}
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <span className="text-xl font-bold text-indigo-600">MediConnect</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button 
                                onClick={handleProfileClick}
                                className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600"
                            >
                                <UserCircle className="h-8 w-8" />
                                <span>Dr. {user?.firstName}</span>
                            </button>
                            <button
                                onClick={handleLogout}
                                className="p-2 text-gray-500 hover:text-red-600"
                            >
                                <LogOut className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {error && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
                    <div className="bg-red-50 text-red-700 p-4 rounded-lg">
                        {error}
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <StatsCard
                        title="Total Patients"
                        value={stats.totalPatients}
                        icon={Users}
                        bgColor="bg-blue-100"
                        textColor="text-blue-600"
                    />
                    <StatsCard
                        title="Today's Appointments"
                        value={stats.todayAppointments}
                        icon={Calendar}
                        bgColor="bg-green-100"
                        textColor="text-green-600"
                    />
                    <StatsCard
                        title="Upcoming"
                        value={stats.upcomingAppointments}
                        icon={Clock}
                        bgColor="bg-yellow-100"
                        textColor="text-yellow-600"
                    />
                    <StatsCard
                        title="Total Earnings"
                        value={`₹${stats.totalEarnings.toLocaleString()}`}
                        icon={IndianRupee}
                        bgColor="bg-purple-100"
                        textColor="text-purple-600"
                    />
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Today's Appointments */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-semibold text-gray-900">Today's Appointments</h2>
                                <button 
                                    onClick={handleAppointmentsClick}
                                    className="text-indigo-600 hover:text-indigo-700 text-sm flex items-center"
                                >
                                    View All
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                {appointments.length > 0 ? (
                                    appointments.map((appointment) => (
                                        <AppointmentCard 
                                            key={appointment._id} 
                                            appointment={appointment} 
                                        />
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-center py-4">
                                        No appointments scheduled for today
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button
                                    onClick={handleAppointmentsClick}
                                    className="p-4 border rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
                                >
                                    <Calendar className="h-6 w-6 text-indigo-600 mb-2" />
                                    <h3 className="font-medium">Manage Appointments</h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        View and manage your appointments
                                    </p>
                                </button>
                                <button
                                    onClick={handleProfileClick}
                                    className="p-4 border rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
                                >
                                    <Settings className="h-6 w-6 text-indigo-600 mb-2" />
                                    <h3 className="font-medium">Profile Settings</h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Update your profile information
                                    </p>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-8">
                        {/* Profile Summary */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="text-center">
                                <div className="inline-block h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center">
                                    <UserCircle className="h-12 w-12 text-indigo-600" />
                                </div>
                                <h2 className="mt-4 text-xl font-semibold text-gray-900">
                                    Dr. {user?.firstName} {user?.lastName}
                                </h2>
                                <p className="text-gray-500">{user?.specialization || 'Specialization'}</p>
                            </div>
                            <div className="mt-6 space-y-4">
                                <div className="flex items-center text-gray-600">
                                    <Mail className="h-5 w-5 mr-3" />
                                    <span>{user?.email}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <Phone className="h-5 w-5 mr-3" />
                                    <span>{user?.phone || 'Add phone number'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Schedule Summary */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Schedule Summary</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Working Hours</span>
                                    <span className="text-gray-900">9:00 AM - 5:00 PM</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Next Available</span>
                                    <span className="text-gray-900">Today, 2:00 PM</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Consultation Fee</span>
                                    <span className="text-gray-900">₹500</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DoctorDashboard;
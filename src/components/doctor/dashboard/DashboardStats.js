// src/components/doctor/dashboard/DashboardStats.js
import React, { useState, useEffect } from 'react';
import { Users, Calendar, Clock, IndianRupee } from 'lucide-react';

const DashboardStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_URL}api/doctor/statistics`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setStats(data.data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                        <div className="h-8 bg-gray-200 rounded"></div>
                    </div>
                ))}
            </div>
        );
    }

    const statCards = [
        {
            title: 'Total Patients',
            value: stats?.totalPatients || 0,
            icon: Users,
            color: 'bg-blue-500'
        },
        {
            title: 'Today\'s Appointments',
            value: stats?.todayAppointments || 0,
            icon: Calendar,
            color: 'bg-green-500'
        },
        {
            title: 'Upcoming',
            value: stats?.upcomingAppointments || 0,
            icon: Clock,
            color: 'bg-yellow-500'
        },
        {
            title: 'Revenue',
            value: `₹${stats?.revenue || 0}`,
            icon: IndianRupee,
            color: 'bg-purple-500'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {statCards.map((card, index) => (
                <div key={index} className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-6">
                        <div className="flex items-center">
                            <div className={`rounded-full p-3 ${card.color} bg-opacity-10`}>
                                <card.icon className={`h-6 w-6 ${card.color.replace('bg-', 'text-')}`} />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                                <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DashboardStats;
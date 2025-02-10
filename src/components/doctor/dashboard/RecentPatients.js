// src/components/doctor/dashboard/RecentPatients.js
import React, { useState, useEffect } from 'react';
import { User, Phone, Calendar, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

const RecentPatients = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRecentPatients();
    }, []);

    const fetchRecentPatients = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_URL}api/doctor/appointments/recent`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setPatients(data.data);
            }
        } catch (error) {
            console.error('Error fetching recent patients:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow">
                <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Patients</h3>
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="animate-pulse flex items-center">
                                <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                                <div className="ml-4 flex-1">
                                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                    <div className="mt-2 h-4 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Recent Patients</h3>
                    <button className="text-sm text-indigo-600 hover:text-indigo-700">
                        View all
                    </button>
                </div>
                <div className="space-y-4">
                    {patients.map((patient) => (
                        <div key={patient._id} className="flex items-center p-4 hover:bg-gray-50 rounded-lg transition-colors">
                            <div className="flex-shrink-0">
                                {patient.profilePhoto ? (
                                    <img
                                        src={patient.profilePhoto}
                                        alt={patient.fullName}
                                        className="h-10 w-10 rounded-full"
                                    />
                                ) : (
                                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                        <User className="h-6 w-6 text-gray-400" />
                                    </div>
                                )}
                            </div>
                            <div className="ml-4 flex-1">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900">{patient.fullName}</h4>
                                        <div className="mt-1 flex items-center text-sm text-gray-500">
                                            <Phone className="h-4 w-4 mr-1" />
                                            {patient.contactNumber}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Calendar className="h-4 w-4 mr-1" />
                                            {format(new Date(patient.lastVisit), 'MMM d, yyyy')}
                                        </div>
                                        <button className="mt-1 text-indigo-600 hover:text-indigo-700">
                                            <ChevronRight className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RecentPatients;
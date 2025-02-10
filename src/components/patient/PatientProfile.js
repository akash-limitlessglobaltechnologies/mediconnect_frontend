import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ChevronLeft } from 'lucide-react';

const PatientProfile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_URL}api/patient/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
            
            if (data.success) {
                setProfile(data.data);
            } else {
                setError('Failed to load profile');
            }
        } catch (error) {
            console.error('Profile fetch error:', error);
            setError('Error connecting to server');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <button 
                            onClick={() => navigate('/patient')}
                            className="flex items-center text-gray-600 hover:text-indigo-600"
                        >
                            <ChevronLeft className="h-5 w-5 mr-1" />
                            Back to Dashboard
                        </button>
                        <h1 className="text-xl font-semibold">My Profile</h1>
                    </div>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-4 py-8">
                {error && (
                    <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-lg flex items-center">
                        <AlertCircle className="h-5 w-5 mr-2" />
                        {error}
                    </div>
                )}

                {profile && (
                    <div className="space-y-6">
                        {/* Basic Information */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-gray-500">Full Name</label>
                                    <p className="font-medium">{profile.fullName}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500">Date of Birth</label>
                                    <p className="font-medium">
                                        {profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : 'Not set'}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500">Gender</label>
                                    <p className="font-medium capitalize">{profile.gender || 'Not set'}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500">Blood Group</label>
                                    <p className="font-medium">{profile.bloodGroup || 'Not set'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-gray-500">Contact Number</label>
                                    <p className="font-medium">{profile.contactNumber || 'Not set'}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500">Address</label>
                                    <p className="font-medium">{profile.address || 'Not set'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Emergency Contact */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-semibold mb-4">Emergency Contact</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-gray-500">Name</label>
                                    <p className="font-medium">{profile.emergencyContact?.name || 'Not set'}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500">Relationship</label>
                                    <p className="font-medium">{profile.emergencyContact?.relationship || 'Not set'}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500">Phone Number</label>
                                    <p className="font-medium">{profile.emergencyContact?.phone || 'Not set'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Medical Information */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-semibold mb-4">Medical Information</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-gray-500">Allergies</label>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {profile.allergies?.length > 0 ? 
                                            profile.allergies.map((allergy, index) => (
                                                <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                                                    {allergy}
                                                </span>
                                            )) : 
                                            <p className="text-gray-500">No allergies listed</p>
                                        }
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500">Chronic Conditions</label>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {profile.chronicConditions?.length > 0 ? 
                                            profile.chronicConditions.map((condition, index) => (
                                                <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                                                    {condition}
                                                </span>
                                            )) : 
                                            <p className="text-gray-500">No chronic conditions listed</p>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientProfile;
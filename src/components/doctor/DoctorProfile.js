// src/components/doctor/DoctorProfile.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
    UserCircle, MapPin, Phone, Mail, Award, 
    Clock, DollarSign, Edit2, ChevronLeft, 
    Calendar, Briefcase, GraduationCap, Star
} from 'lucide-react';

function DoctorProfile() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_URL}api/doctor/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            
            if (data.success) {
                setProfile(data.data);
                setFormData(data.data);
            } else {
                setError('Failed to fetch profile');
            }
        } catch (err) {
            setError('Error fetching profile');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const parts = name.split('.');
            const newObj = { ...prev };
            let current = newObj;
            
            for (let i = 0; i < parts.length - 1; i++) {
                current[parts[i]] = { ...current[parts[i]] };
                current = current[parts[i]];
            }
            
            current[parts[parts.length - 1]] = value;
            return newObj;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_URL}api/doctor/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (data.success) {
                setProfile(data.data);
                setIsEditing(false);
                fetchProfile(); // Refresh the profile data
            } else {
                setError('Failed to update profile');
            }
        } catch (err) {
            setError('Error updating profile');
        }
    };

    if (loading || !profile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    const EditForm = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
                        <button 
                            onClick={() => setIsEditing(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Personal Information */}
                            <div className="col-span-2">
                                <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b">
                                    Personal Information
                                </h3>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="personalInfo.fullName"
                                    value={formData.personalInfo.fullName}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Contact Number
                                </label>
                                <input
                                    type="text"
                                    name="personalInfo.contactNumber"
                                    value={formData.personalInfo.contactNumber}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            {/* Professional Information */}
                            <div className="col-span-2">
                                <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b mt-6">
                                    Professional Information
                                </h3>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Specialization
                                </label>
                                <input
                                    type="text"
                                    name="professionalInfo.specialization"
                                    value={formData.professionalInfo.specialization}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Years of Experience
                                </label>
                                <input
                                    type="number"
                                    name="professionalInfo.experience"
                                    value={formData.professionalInfo.experience}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Consultation Fee ($)
                                </label>
                                <input
                                    type="number"
                                    name="pricing.consultationFee"
                                    value={formData.pricing.consultationFee}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            {/* Bio */}
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Professional Bio
                                </label>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleInputChange}
                                    rows="4"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-end space-x-3 pt-6">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="bg-white shadow">
                <div className="h-40 w-full bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative -mt-20 pb-6">
                        <div className="flex flex-col sm:flex-row items-center sm:items-end sm:space-x-5">
                            <div className="relative">
                                <div className="h-32 w-32 rounded-full ring-4 ring-white bg-white overflow-hidden">
                                    {profile.personalInfo?.profilePhoto ? (
                                        <img 
                                            src={profile.personalInfo.profilePhoto} 
                                            alt={profile.personalInfo.fullName}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <UserCircle className="h-full w-full text-gray-300" />
                                    )}
                                </div>
                            </div>
                            <div className="mt-6 sm:mt-0 flex-1 text-center sm:text-left">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">
                                            Dr. {profile.personalInfo.fullName}
                                        </h1>
                                        <p className="text-lg text-indigo-600 font-medium">
                                            {profile.professionalInfo.specialization}
                                        </p>
                                    </div>
                                    <div className="mt-4 sm:mt-0 flex justify-center sm:justify-end space-x-3">
                                        <button
                                            onClick={() => navigate('/doctor')}
                                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                        >
                                            <ChevronLeft className="h-4 w-4 mr-1" />
                                            Back
                                        </button>
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                                        >
                                            <Edit2 className="h-4 w-4 mr-1" />
                                            Edit Profile
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Sidebar - Info Cards */}
                    <div className="space-y-6">
                        {/* Contact Information */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                            <div className="space-y-4">
                                <div className="flex items-center text-gray-600">
                                    <Phone className="h-5 w-5 mr-3 text-gray-400" />
                                    <span>{profile.personalInfo.contactNumber}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <Mail className="h-5 w-5 mr-3 text-gray-400" />
                                    <span>{user?.email}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <MapPin className="h-5 w-5 mr-3 text-gray-400" />
                                    <span>{profile.personalInfo.address || 'Address not specified'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Professional Details */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Professional Details</h3>
                            <div className="space-y-4">
                                <div className="flex items-center text-gray-600">
                                    <Award className="h-5 w-5 mr-3 text-gray-400" />
                                    <span>License: {profile.professionalInfo.licenseNumber}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <Briefcase className="h-5 w-5 mr-3 text-gray-400" />
                                    <span>{profile.professionalInfo.experience} years experience</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <DollarSign className="h-5 w-5 mr-3 text-gray-400" />
                                    <span>Consultation: ${profile.pricing.consultationFee}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* About Section */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">About</h3>
                            <p className="text-gray-600 whitespace-pre-line">{profile.bio}</p>
                        </div>

                        {/* Qualifications */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Education & Qualifications</h3>
                            <div className="space-y-6">
                                {profile.professionalInfo.qualification?.map((qual, index) => (
                                    <div key={index} className="relative pl-8 border-l-2 border-indigo-200">
                                        <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-indigo-500"></div>
                                        <div className="mb-1">
                                            <h4 className="text-gray-900 font-medium flex items-center">
                                                <GraduationCap className="h-5 w-5 mr-2 text-indigo-500" />
                                                {qual.degree}
                                            </h4>
                                        </div>
                                        <p className="text-gray-600">{qual.institution}</p>
                                        <p className="text-gray-500 text-sm">{qual.year}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Expertise */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Areas of Expertise</h3>
                            <div className="flex flex-wrap gap-2">
                                {profile.expertise?.map((item, index) => (
                                    <span 
                                        key={index}
                                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                                    >
                                        <Star className="h-4 w-4 mr-1" />
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Availability Schedule */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Availability Schedule</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {profile.availability?.days.map((day, index) => (
                                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                                        <Calendar className="h-5 w-5 mr-3 text-indigo-500" />
                                        <div>
                                            <p className="font-medium text-gray-900">{day}</p>
                                            {profile.availability.timeSlots.map((slot, idx) => (
                                                <p key={idx} className="text-sm text-gray-600">
                                                    {slot.startTime} - {slot.endTime}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {isEditing && <EditForm />}

            {/* Error Alert */}
            {error && (
                <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg">
                    <div className="flex items-center">
                        <div className="py-1">
                            <svg className="fill-current h-6 w-6 text-red-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/>
                            </svg>
                        </div>
                        <div>
                            <p className="font-bold">Error</p>
                            <p className="text-sm">{error}</p>
                        </div>
                        <button 
                            onClick={() => setError(null)}
                            className="ml-6"
                        >
                            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <title>Close</title>
                                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DoctorProfile;
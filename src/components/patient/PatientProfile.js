import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ChevronLeft, Save, X } from 'lucide-react';

const PatientProfile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '',
        dateOfBirth: '',
        gender: '',
        bloodGroup: '',
        contactNumber: '',
        address: '',
        emergencyContact: {
            name: '',
            relationship: '',
            phone: ''
        },
        allergies: [],
        chronicConditions: [],
        newAllergy: '',
        newCondition: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await fetch('/api/patients/profile');
            const data = await response.json();
            
            if (data.success) {
                setProfile(data.data);
                setFormData({
                    ...data.data,
                    newAllergy: '',
                    newCondition: ''
                });
            } else {
                setError('Failed to load profile');
            }
        } catch (error) {
            setError('Error connecting to server');
        } finally {
            setLoading(false);
        }
    };

    const handleAddAllergy = () => {
        if (formData.newAllergy.trim()) {
            setFormData(prev => ({
                ...prev,
                allergies: [...prev.allergies, prev.newAllergy.trim()],
                newAllergy: ''
            }));
        }
    };

    const handleRemoveAllergy = (index) => {
        setFormData(prev => ({
            ...prev,
            allergies: prev.allergies.filter((_, i) => i !== index)
        }));
    };

    const handleAddCondition = () => {
        if (formData.newCondition.trim()) {
            setFormData(prev => ({
                ...prev,
                chronicConditions: [...prev.chronicConditions, prev.newCondition.trim()],
                newCondition: ''
            }));
        }
    };

    const handleRemoveCondition = (index) => {
        setFormData(prev => ({
            ...prev,
            chronicConditions: prev.chronicConditions.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const submitData = { ...formData };
            delete submitData.newAllergy;
            delete submitData.newCondition;

            const response = await fetch('/api/patients/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(submitData)
            });

            const data = await response.json();
            if (data.success) {
                setProfile(data.data);
                setEditing(false);
                setError(null);
            } else {
                setError('Failed to update profile');
            }
        } catch (error) {
            setError('Error updating profile');
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
                        <h1 className="text-xl font-semibold">Profile Settings</h1>
                        <button
                            onClick={() => setEditing(!editing)}
                            className={`px-4 py-2 rounded-lg ${
                                editing 
                                    ? 'border border-gray-300 text-gray-700 hover:border-indigo-600 hover:text-indigo-600' 
                                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                            }`}
                        >
                            {editing ? 'Cancel' : 'Edit Profile'}
                        </button>
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

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                    disabled={!editing}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Date of Birth
                                </label>
                                <input
                                    type="date"
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    value={formData.dateOfBirth?.split('T')[0]}
                                    onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                                    disabled={!editing}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Gender
                                </label>
                                <select
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    value={formData.gender}
                                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                                    disabled={!editing}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Blood Group
                                </label>
                                <select
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    value={formData.bloodGroup}
                                    onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
                                    disabled={!editing}
                                >
                                    <option value="">Select Blood Group</option>
                                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => (
                                        <option key={group} value={group}>{group}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Contact Number
                                </label>
                                <input
                                    type="tel"
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    value={formData.contactNumber}
                                    onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                                    disabled={!editing}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Address
                                </label>
                                <textarea
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    rows="3"
                                    value={formData.address}
                                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                                    disabled={!editing}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Emergency Contact */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-semibold mb-4">Emergency Contact</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    value={formData.emergencyContact.name}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        emergencyContact: {
                                            ...formData.emergencyContact,
                                            name: e.target.value
                                        }
                                    })}
                                    disabled={!editing}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Relationship
                                </label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    value={formData.emergencyContact.relationship}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        emergencyContact: {
                                            ...formData.emergencyContact,
                                            relationship: e.target.value
                                        }
                                    })}
                                    disabled={!editing}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    value={formData.emergencyContact.phone}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        emergencyContact: {
                                            ...formData.emergencyContact,
                                            phone: e.target.value
                                        }
                                    })}
                                    disabled={!editing}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Medical Information */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-semibold mb-4">Medical Information</h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Allergies
                                </label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        value={formData.newAllergy}
                                        onChange={(e) => setFormData({...formData, newAllergy: e.target.value})}
                                        disabled={!editing}
                                        placeholder="Add new allergy"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddAllergy}
                                        disabled={!editing}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300"
                                    >
                                        Add
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.allergies.map((allergy, index) => (
                                        <span
                                            key={index}
                                            className="bg-gray-100 px-3 py-1 rounded-full flex items-center"
                                        >
                                            {allergy}
                                            {editing && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveAllergy(index)}
                                                    className="ml-2 text-gray-500 hover:text-red-500"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            )}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Chronic Conditions
                                </label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        value={formData.newCondition}
                                        onChange={(e) => setFormData({...formData, newCondition: e.target.value})}
                                        disabled={!editing}
                                        placeholder="Add new condition"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddCondition}
                                        disabled={!editing}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300"
                                    >
                                        Add
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.chronicConditions.map((condition, index) => (
                                        <span
                                            key={index}
                                            className="bg-gray-100 px-3 py-1 rounded-full flex items-center"
                                        >
                                            {condition}
                                            {editing && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveCondition(index)}
                                                    className="ml-2 text-gray-500 hover:text-red-500"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            )}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    {editing && (
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                            >
                                <Save className="h-4 w-4" />
                                Save Changes
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default PatientProfile;
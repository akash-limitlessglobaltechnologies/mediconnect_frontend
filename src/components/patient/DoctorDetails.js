import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Clock, Star, Calendar } from 'lucide-react';

const DoctorDetails = () => {
    const { doctorId } = useParams();
    const navigate = useNavigate();
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Format base URL to handle potential trailing slash
    const baseUrl = process.env.REACT_APP_API_URL?.endsWith('/')
        ? process.env.REACT_APP_API_URL.slice(0, -1)
        : process.env.REACT_APP_API_URL;

    useEffect(() => {
        fetchDoctorDetails();
    }, [doctorId]);

    const fetchDoctorDetails = async () => {
        try {
            setLoading(true);
            console.log('Fetching doctor details for ID:', doctorId);
            
            const url = `${baseUrl}/api/doctor/${doctorId}/details`;
            console.log('Fetching from URL:', url);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                const text = await response.text();
                console.error('Error response:', text);
                throw new Error(`Failed to fetch doctor details: ${response.status}`);
            }

            const data = await response.json();
            console.log('Received data:', data);
            
            if (data.success) {
                setDoctor(data.data);
            } else {
                throw new Error(data.message || 'Failed to fetch doctor details');
            }
        } catch (error) {
            console.error('Error fetching doctor details:', error);
            setError(error.message || 'Error connecting to server');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error || !doctor) {
        return (
            <div className="max-w-2xl mx-auto p-4">
                <div className="bg-red-50 text-red-700 p-4 rounded-lg">
                    {error || 'Doctor not found'}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Header Section */}
                <div className="p-6 border-b">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold mb-2">
                                Dr. {doctor.personalInfo.fullName}
                            </h1>
                            <p className="text-indigo-600 font-medium">
                                {doctor.professionalInfo.specialization}
                            </p>
                            <div className="flex items-center mt-2 text-gray-600">
                                <MapPin className="w-4 h-4 mr-2" />
                                {doctor.personalInfo.city}
                            </div>
                            <div className="flex items-center mt-2">
                                <Star className="w-4 h-4 text-yellow-400 mr-2" />
                                <span>{doctor.ratings?.average?.toFixed(1) || 'New'}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-indigo-600">
                                ₹{doctor.pricing.consultationFee}
                            </p>
                            <button
    onClick={() => navigate(`/patient/book-appointment/${doctorId}`)}
    className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
>
    Book Appointment
</button>
                        </div>
                    </div>
                </div>

                {/* Details Section */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div>
                        <h2 className="text-lg font-semibold mb-4">About</h2>
                        <p className="text-gray-600">{doctor.bio}</p>

                        <h2 className="text-lg font-semibold mt-6 mb-4">Experience & Expertise</h2>
                        <p className="text-gray-600 mb-4">
                            {doctor.professionalInfo.experience} years of experience
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {doctor.expertise?.map((exp, index) => (
                                <span
                                    key={index}
                                    className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm"
                                >
                                    {exp}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Right Column */}
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Availability</h2>
                        <div className="space-y-3">
                            {doctor.availability.days.map((day, index) => (
                                <div key={index} className="flex items-center text-gray-600">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    <span>{day}</span>
                                </div>
                            ))}
                        </div>

                        <h2 className="text-lg font-semibold mt-6 mb-4">Services</h2>
                        <div className="space-y-4">
                            {doctor.services?.map((service, index) => (
                                <div key={index} className="border-b pb-3">
                                    <h3 className="font-medium">{service.name}</h3>
                                    <p className="text-sm text-gray-600">{service.description}</p>
                                    <p className="text-sm text-indigo-600 mt-1">₹{service.fee}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorDetails;
// components/patient/DoctorDetails.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Phone, Mail, Award } from 'lucide-react';

const DoctorDetails = () => {
    const { doctorId } = useParams();
    const navigate = useNavigate();
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDoctorDetails();
    }, [doctorId]);

    const fetchDoctorDetails = async () => {
        try {
            const response = await fetch(`/api/doctors/${doctorId}/details`);
            const data = await response.json();
            
            if (data.success) {
                setDoctor(data.data);
            }
        } catch (error) {
            console.error('Error fetching doctor details:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!doctor) return <div>Doctor not found</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Doctor Header */}
                <div className="p-6 border-b">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">
                                Dr. {doctor.personalInfo.fullName}
                            </h1>
                            <p className="text-gray-600">
                                {doctor.professionalInfo.specialization}
                            </p>
                            <div className="flex items-center mt-2">
                                <MapPin className="w-4 h-4 text-gray-500 mr-2" />
                                <span className="text-gray-600">
                                    {doctor.personalInfo.city}
                                </span>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-indigo-600">
                                ₹{doctor.pricing.consultationFee}
                            </p>
                            <button
                                onClick={() => navigate(`/patient/book-appointment/${doctorId}`)}
                                className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg"
                            >
                                Book Appointment
                            </button>
                        </div>
                    </div>
                </div>

                {/* Doctor Info */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h2 className="text-lg font-semibold mb-4">About</h2>
                        <p className="text-gray-600">{doctor.bio}</p>
                        
                        <h2 className="text-lg font-semibold mt-6 mb-4">Expertise</h2>
                        <div className="flex flex-wrap gap-2">
                            {doctor.expertise.map((exp, index) => (
                                <span
                                    key={index}
                                    className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm"
                                >
                                    {exp}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold mb-4">Availability</h2>
                        <div className="space-y-4">
                            {doctor.availability.days.map((day, index) => (
                                <div key={index} className="flex items-center">
                                    <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                                    <span>{day}</span>
                                </div>
                            ))}
                        </div>

                        <h2 className="text-lg font-semibold mt-6 mb-4">Services</h2>
                        <div className="space-y-4">
                            {doctor.services.map((service, index) => (
                                <div key={index} className="border-b pb-2">
                                    <h3 className="font-medium">{service.name}</h3>
                                    <p className="text-sm text-gray-600">
                                        {service.description}
                                    </p>
                                    <p className="text-sm text-indigo-600 mt-1">
                                        ₹{service.fee}
                                    </p>
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
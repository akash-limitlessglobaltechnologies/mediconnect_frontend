import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, AlertCircle, X, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Alert = ({ message, onClose }) => (
    <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center justify-between">
        <div className="flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {message}
        </div>
        {onClose && (
            <button onClick={onClose}>
                <X className="w-5 h-5" />
            </button>
        )}
    </div>
);

const AppointmentBooking = () => {
    const { doctorId } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [bookingDetails, setBookingDetails] = useState({
        type: 'consultation',
        description: '',
        symptoms: [],
        newSymptom: ''
    });

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        fetchDoctorDetails();
    }, [doctorId, isAuthenticated]);

    useEffect(() => {
        if (selectedDate) {
            fetchAvailableSlots();
        }
    }, [selectedDate]);

    const fetchDoctorDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `${process.env.REACT_APP_API_URL}api/doctor/${doctorId}/details`, 
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch doctor details');
            }

            const data = await response.json();
            if (data.success) {
                setDoctor(data.data);
            } else {
                throw new Error(data.message || 'Failed to fetch doctor details');
            }
        } catch (error) {
            console.error('Error:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchAvailableSlots = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `${process.env.REACT_APP_API_URL}api/doctor/${doctorId}/available-slots?date=${selectedDate}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch available slots');
            }

            const data = await response.json();
            if (data.success) {
                setAvailableSlots(data.data.slots || []);
            } else {
                throw new Error(data.message || 'Failed to fetch available slots');
            }
        } catch (error) {
            console.error('Error:', error);
            setError(error.message);
        }
    };

    // Inside AppointmentBooking.js, update the handleBookAppointment function

const handleBookAppointment = async () => {
    try {
        setLoading(true);
        const token = localStorage.getItem('token');
            
        const bookingData = {
            doctorId,
            appointmentDate: selectedDate, // Make sure this is in YYYY-MM-DD format
            timeSlot: selectedSlot,
            type: bookingDetails.type,
            description: bookingDetails.description,
            symptoms: bookingDetails.symptoms
        };

        console.log('Sending booking data:', bookingData); // Debug log

        const response = await fetch(`${process.env.REACT_APP_API_URL}api/doctor/patient/appointments/book`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(bookingData)
        });

        const data = await response.json();
        console.log('Booking response:', data); // Debug log

        if (!response.ok) {
            throw new Error(data.message || 'Failed to book appointment');
        }
            
        if (data.success) {
            navigate('/patient/appointments');
        } else {
            throw new Error(data.message || 'Failed to book appointment');
        }
    } catch (error) {
        console.error('Error:', error);
        setError(error.message || 'Error booking appointment');
    } finally {
        setLoading(false);
    }
};

    const handleAddSymptom = () => {
        if (bookingDetails.newSymptom.trim()) {
            setBookingDetails(prev => ({
                ...prev,
                symptoms: [...prev.symptoms, prev.newSymptom.trim()],
                newSymptom: ''
            }));
        }
    };

    const handleRemoveSymptom = (index) => {
        setBookingDetails(prev => ({
            ...prev,
            symptoms: prev.symptoms.filter((_, i) => i !== index)
        }));
    };

    // Get today's date and max date (30 days from now)
    const today = new Date().toISOString().split('T')[0];
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    const maxDateString = maxDate.toISOString().split('T')[0];

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center text-gray-600 hover:text-indigo-600"
                        >
                            <ArrowLeft className="h-5 w-5 mr-2" />
                            Back
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900 ml-4">Book Appointment</h1>
                    </div>
                </div>
            </div>

            <div className="max-w-2xl mx-auto p-4">
                {/* Doctor Info */}
                {doctor && (
                    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                        <h2 className="text-xl font-semibold">
                            Dr. {doctor.personalInfo.fullName}
                        </h2>
                        <p className="text-gray-600">{doctor.professionalInfo.specialization}</p>
                        <p className="text-indigo-600 font-medium mt-2">
                            Consultation Fee: ₹{doctor.pricing.consultationFee}
                        </p>
                    </div>
                )}

                {/* Booking Form */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    {error && (
                        <Alert
                            message={error}
                            onClose={() => setError(null)}
                            className="mb-6"
                        />
                    )}

                    {/* Date Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Date
                        </label>
                        <input
                            type="date"
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            min={today}
                            max={maxDateString}
                        />
                    </div>

                    {/* Time Slots */}
                    {selectedDate && (
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Available Time Slots
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {availableSlots.map((slot, index) => (
                                    <button
                                        key={index}
                                        className={`p-2 border rounded-lg flex items-center justify-center ${
                                            selectedSlot === slot
                                                ? 'bg-indigo-600 text-white border-indigo-600'
                                                : 'hover:border-indigo-600'
                                        }`}
                                        onClick={() => setSelectedSlot(slot)}
                                    >
                                        <Clock className="w-4 h-4 mr-2" />
                                        {slot.startTime}
                                    </button>
                                ))}
                                {availableSlots.length === 0 && (
                                    <p className="col-span-3 text-center text-gray-500 py-4">
                                        No slots available for selected date
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Appointment Type */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Appointment Type
                        </label>
                        <select
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                            value={bookingDetails.type}
                            onChange={(e) => setBookingDetails(prev => ({
                                ...prev,
                                type: e.target.value
                            }))}
                        >
                            <option value="consultation">Consultation</option>
                            <option value="follow-up">Follow-up</option>
                            <option value="emergency">Emergency</option>
                        </select>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                            rows="3"
                            value={bookingDetails.description}
                            onChange={(e) => setBookingDetails(prev => ({
                                ...prev,
                                description: e.target.value
                            }))}
                            placeholder="Please describe your health concern briefly"
                        />
                    </div>

                    {/* Symptoms */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Symptoms
                        </label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                value={bookingDetails.newSymptom}
                                onChange={(e) => setBookingDetails(prev => ({
                                    ...prev,
                                    newSymptom: e.target.value
                                }))}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddSymptom();
                                    }
                                }}
                                placeholder="Type a symptom and press Enter or Add"
                            />
                            <button
                                onClick={handleAddSymptom}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                            >
                                Add
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {bookingDetails.symptoms.map((symptom, index) => (
                                <span
                                    key={index}
                                    className="bg-gray-100 px-3 py-1 rounded-full flex items-center"
                                >
                                    {symptom}
                                    <button
                                        onClick={() => handleRemoveSymptom(index)}
                                        className="ml-2 text-gray-500 hover:text-red-500"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleBookAppointment}
                        disabled={!selectedDate || !selectedSlot || !bookingDetails.description || loading}
                        className={`w-full py-3 rounded-lg transition-colors
                            ${loading 
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                            }
                            disabled:bg-gray-300 disabled:cursor-not-allowed`}
                    >
                        {loading ? 'Booking...' : 'Confirm Booking'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AppointmentBooking;
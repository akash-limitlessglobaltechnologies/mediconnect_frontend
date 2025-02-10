import React, { useState, useEffect } from 'react';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';

const AppointmentBooking = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({
    type: 'consultation',
    description: '',
    symptoms: [],
    newSymptom: '' // For managing symptom input
  });

  // Fetch doctor details on component mount
  useEffect(() => {
    fetchDoctorDetails();
  }, [doctorId]);

  // Fetch available slots when date changes
  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedDate]);

  const fetchDoctorDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/doctors/${doctorId}/details`);
      const data = await response.json();
      
      if (data.success) {
        setDoctor(data.data);
      } else {
        setError('Failed to fetch doctor details');
      }
    } catch (error) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSlots = async () => {
    try {
      const response = await fetch(`/api/doctors/${doctorId}/available-slots?date=${selectedDate}`);
      const data = await response.json();
      
      if (data.success) {
        setAvailableSlots(data.data.slots);
      } else {
        setError('Failed to fetch available slots');
      }
    } catch (error) {
      setError('Error fetching time slots');
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

  const handleBookAppointment = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/doctors/patient/appointments/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          doctorId,
          appointmentDate: selectedDate,
          timeSlot: selectedSlot,
          type: bookingDetails.type,
          description: bookingDetails.description,
          symptoms: bookingDetails.symptoms
        })
      });

      const data = await response.json();
      if (data.success) {
        navigate('/patient/appointments');
      } else {
        setError('Failed to book appointment');
      }
    } catch (error) {
      setError('Error booking appointment');
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

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Doctor Info Section */}
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
        <h3 className="text-lg font-semibold mb-6">Book Appointment</h3>

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
            min={format(new Date(), 'yyyy-MM-dd')}
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
            placeholder="Briefly describe your health concern"
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
              placeholder="Add a symptom"
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
          disabled={!selectedDate || !selectedSlot || !bookingDetails.description}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 
                   disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
};

export default AppointmentBooking;
// src/components/doctor/appointments/AppointmentDetails.js
import React, { useState } from 'react';
import { format } from 'date-fns';
import { 
    Clock, User, Phone, Mail, Calendar,
    FileText, Tag, IndianRupee, X 
} from 'lucide-react';

const AppointmentDetails = ({ appointment, onClose }) => {
    const [status, setStatus] = useState(appointment.status);
    const [loading, setLoading] = useState(false);

    const updateStatus = async (newStatus) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_URL}api/doctor/appointments/${appointment._id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            const data = await response.json();
            if (data.success) {
                setStatus(newStatus);
            }
        } catch (error) {
            console.error('Error updating status:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow">
            {/* Header */}
            <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                    Appointment Details
                </h2>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500"
                >
                    <X className="h-6 w-6" />
                </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
                {/* Patient Info */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Patient Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center">
                            <User className="h-5 w-5 text-gray-400 mr-3" />
                            <span>{appointment.patientId.fullName}</span>
                        </div>
                        <div className="flex items-center">
                            <Phone className="h-5 w-5 text-gray-400 mr-3" />
                            <span>{appointment.patientId.contactNumber}</span>
                        </div>
                        <div className="flex items-center">
                            <Mail className="h-5 w-5 text-gray-400 mr-3" />
                            <span>{appointment.patientId.email}</span>
                        </div>
                    </div>
                </div>

                {/* Appointment Info */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Appointment Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center">
                            <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                            <span>{format(new Date(appointment.appointmentDate), 'MMMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center">
                            <Clock className="h-5 w-5 text-gray-400 mr-3" />
                            <span>{appointment.timeSlot.startTime} - {appointment.timeSlot.endTime}</span>
                        </div>
                        <div className="flex items-center">
                            <Tag className="h-5 w-5 text-gray-400 mr-3" />
                            <span className="capitalize">{appointment.type}</span>
                        </div>
                        <div className="flex items-center">
                            <IndianRupee className="h-5 w-5 text-gray-400 mr-3" />
                            <span>₹{appointment.fee.amount}</span>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <h3 className="text-lg font-medium text-gray-900">Description</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <FileText className="h-5 w-5 text-gray-400 mb-2" />
                        <p className="text-gray-600">{appointment.description}</p>
                    </div>
                </div>

                {/* Status Update */}
                <div className="border-t pt-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">Status</h3>
                            <p className="text-sm text-gray-500">Update appointment status</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => updateStatus('completed')}
                                disabled={loading || status === 'completed'}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                            >
                                Complete
                            </button>
                            <button
                                onClick={() => updateStatus('cancelled')}
                                disabled={loading || status === 'cancelled'}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppointmentDetails;
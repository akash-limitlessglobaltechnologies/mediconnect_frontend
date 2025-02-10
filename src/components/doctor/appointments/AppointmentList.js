// src/components/doctor/appointments/AppointmentList.js
import React from 'react';
import { format } from 'date-fns';
import { Clock, User } from 'lucide-react';

const AppointmentList = ({ appointments, selectedDate, onSelectAppointment, loading }) => {
    if (loading) {
        return (
            <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (appointments.length === 0) {
        return (
            <div className="text-center py-4 text-gray-500">
                No appointments for {format(selectedDate, 'MMMM d, yyyy')}
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
                Appointments for {format(selectedDate, 'MMMM d, yyyy')}
            </h3>
            {appointments.map((appointment) => (
                <div
                    key={appointment._id}
                    onClick={() => onSelectAppointment(appointment)}
                    className="border rounded-lg p-3 cursor-pointer hover:border-indigo-500 transition-colors"
                >
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                            <User className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="font-medium text-gray-900">
                                {appointment.patientId.fullName}
                            </span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                            {
                                'scheduled': 'bg-blue-100 text-blue-800',
                                'completed': 'bg-green-100 text-green-800',
                                'cancelled': 'bg-red-100 text-red-800',
                                'no-show': 'bg-gray-100 text-gray-800'
                            }[appointment.status]
                        }`}>
                            {appointment.status}
                        </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-2" />
                        {appointment.timeSlot.startTime} - {appointment.timeSlot.endTime}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AppointmentList;
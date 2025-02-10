// src/components/doctor/appointments/AppointmentCalendar.js
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { format } from 'date-fns';
import AppointmentList from './AppointmentList';
import AppointmentDetails from './AppointmentDetails';
import 'react-calendar/dist/Calendar.css';

const AppointmentCalendar = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [appointments, setAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAppointments(selectedDate);
    }, [selectedDate]);

    const fetchAppointments = async (date) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const formattedDate = format(date, 'yyyy-MM-dd');
            const response = await fetch(`${process.env.REACT_APP_API_URL}api/doctor/appointments/${formattedDate}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setAppointments(data.data);
            }
        } catch (error) {
            console.error('Error fetching appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        setSelectedAppointment(null);
    };

    return (
        <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
                <div className="bg-white rounded-lg shadow p-4">
                    <Calendar
                        onChange={handleDateChange}
                        value={selectedDate}
                        className="w-full border-none"
                        tileClassName="rounded-lg hover:bg-indigo-50"
                    />
                </div>
                <div className="mt-4 bg-white rounded-lg shadow p-4">
                    <AppointmentList
                        appointments={appointments}
                        selectedDate={selectedDate}
                        onSelectAppointment={setSelectedAppointment}
                        loading={loading}
                    />
                </div>
            </div>
            <div className="md:w-2/3">
                {selectedAppointment ? (
                    <AppointmentDetails
                        appointment={selectedAppointment}
                        onClose={() => setSelectedAppointment(null)}
                    />
                ) : (
                    <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                        Select an appointment to view details
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppointmentCalendar;
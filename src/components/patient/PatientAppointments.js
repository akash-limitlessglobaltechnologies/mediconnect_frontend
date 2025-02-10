import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, ChevronLeft, AlertCircle, Filter } from 'lucide-react';
import { 
    Card, CardContent, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AppointmentCard = ({ appointment }) => {
    const statusColors = {
        scheduled: 'bg-blue-100 text-blue-800',
        completed: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800',
        'no-show': 'bg-yellow-100 text-yellow-800'
    };

    return (
        <Card>
            <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-medium">Dr. {appointment.doctorName}</h3>
                        <p className="text-gray-500">{appointment.specialization}</p>
                        <div className="flex items-center mt-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4 mr-2" />
                            {new Date(appointment.appointmentDate).toLocaleDateString()}
                            <Clock className="w-4 h-4 ml-4 mr-2" />
                            {appointment.timeSlot.startTime}
                        </div>
                        {appointment.description && (
                            <p className="mt-2 text-sm text-gray-600">
                                {appointment.description}
                            </p>
                        )}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${statusColors[appointment.status]}`}>
                        {appointment.status}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
};

const PatientAppointments = () => {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await fetch('/api/doctors/patient/appointments');
            const data = await response.json();
            
            if (data.success) {
                setAppointments(data.data.appointments);
            } else {
                setError('Failed to load appointments');
            }
        } catch (error) {
            setError('Error connecting to server');
        } finally {
            setLoading(false);
        }
    };

    const filteredAppointments = appointments.filter(appointment => {
        if (filter === 'all') return true;
        return appointment.status === filter;
    });

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
                        <Button
                            onClick={() => navigate('/patient/search-doctors')}
                        >
                            Book New Appointment
                        </Button>
                    </div>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-4 py-8">
                {error && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <Card className="mb-6">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>My Appointments</CardTitle>
                            <div className="flex items-center space-x-2">
                                <Filter className="h-4 w-4 text-gray-500" />
                                <Select value={filter} onValueChange={setFilter}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Filter by status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Appointments</SelectItem>
                                        <SelectItem value="scheduled">Scheduled</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                        <SelectItem value="no-show">No Show</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                <div className="space-y-4">
                    {filteredAppointments.length > 0 ? (
                        filteredAppointments.map((appointment) => (
                            <AppointmentCard 
                                key={appointment._id} 
                                appointment={appointment} 
                            />
                        ))
                    ) : (
                        <Card>
                            <CardContent className="p-6 text-center text-gray-500">
                                No appointments found
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PatientAppointments;
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Import Guards
import { 
    PrivateRoute, 
    RoleGuard, 
    DoctorDashboardGuard, 
    PatientDashboardGuard 
} from './components/guards/RouteGuards';

// Component Imports
import Login from './components/Login';
import GoogleCallback from './components/GoogleCallback';
import RoleSelection from './components/RoleSelection';
import PatientRegistration from './components/PatientRegistration';
import DoctorRegistration from './components/doctor/DoctorRegistration';
import DoctorDashboard from './components/DoctorDashboard';
import DoctorProfile from './components/doctor/DoctorProfile';
import PatientDashboard from './components/PatientDashboard';
import PatientProfile from './components/patient/PatientProfile';
import DoctorSearch from './components/patient/DoctorSearch';
import DoctorDetails from './components/patient/DoctorDetails';
import AppointmentBooking from './components/patient/AppointmentBooking'; // Add this import

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/google-callback" element={<GoogleCallback />} />

                    {/* Protected Routes */}
                    <Route 
                        path="/role-selection" 
                        element={
                            <PrivateRoute>
                                <RoleSelection />
                            </PrivateRoute>
                        } 
                    />

                    {/* Patient Routes */}
                    <Route 
                        path="/patient/register" 
                        element={
                            <PrivateRoute>
                                <RoleGuard allowedRole="patient">
                                    <PatientRegistration />
                                </RoleGuard>
                            </PrivateRoute>
                        } 
                    />
                    <Route 
                        path="/patient" 
                        element={
                            <PrivateRoute>
                                <RoleGuard allowedRole="patient">
                                    <PatientDashboardGuard>
                                        <PatientDashboard />
                                    </PatientDashboardGuard>
                                </RoleGuard>
                            </PrivateRoute>
                        } 
                    />
                    <Route 
                        path="/patient/profile" 
                        element={
                            <PrivateRoute>
                                <RoleGuard allowedRole="patient">
                                    <PatientProfile />
                                </RoleGuard>
                            </PrivateRoute>
                        } 
                    />
                    <Route 
                        path="/patient/search-doctors" 
                        element={
                            <PrivateRoute>
                                <RoleGuard allowedRole="patient">
                                    <DoctorSearch />
                                </RoleGuard>
                            </PrivateRoute>
                        } 
                    />
                    <Route 
                        path="/patient/doctor/:doctorId" 
                        element={
                            <PrivateRoute>
                                <RoleGuard allowedRole="patient">
                                    <DoctorDetails />
                                </RoleGuard>
                            </PrivateRoute>
                        } 
                    />
                    {/* Add Appointment Booking Route */}
                    <Route 
                        path="/patient/book-appointment/:doctorId" 
                        element={
                            <PrivateRoute>
                                <RoleGuard allowedRole="patient">
                                    <AppointmentBooking />
                                </RoleGuard>
                            </PrivateRoute>
                        } 
                    />

                    {/* Doctor Routes */}
                    <Route 
                        path="/doctor/register" 
                        element={
                            <PrivateRoute>
                                <RoleGuard allowedRole="doctor">
                                    <DoctorRegistration />
                                </RoleGuard>
                            </PrivateRoute>
                        } 
                    />
                    <Route 
                        path="/doctor/*" 
                        element={
                            <PrivateRoute>
                                <RoleGuard allowedRole="doctor">
                                    <DoctorDashboardGuard>
                                        <DoctorDashboard />
                                    </DoctorDashboardGuard>
                                </RoleGuard>
                            </PrivateRoute>
                        } 
                    />
                    <Route 
                        path="/doctor/profile" 
                        element={
                            <PrivateRoute>
                                <RoleGuard allowedRole="doctor">
                                    <DoctorProfile />
                                </RoleGuard>
                            </PrivateRoute>
                        } 
                    />

                    {/* Root and Catch-all Routes */}
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import GoogleCallback from './components/GoogleCallback';
import RoleSelection from './components/RoleSelection';
import PatientRegistration from './components/PatientRegistration';
import DoctorRegistration from './components/doctor/DoctorRegistration';
import DoctorDashboard from './components/DoctorDashboard';
import PatientDashboard from './components/PatientDashboard';
import { useAuth } from './context/AuthContext';

// Protected Route Component
const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return children;
};

// Route Guard for Patient Dashboard
const PatientDashboardGuard = ({ children }) => {
    const { user } = useAuth();
    const [hasProfile, setHasProfile] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const checkProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:5001/api/patient/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                setHasProfile(data.success);
            } catch (error) {
                setHasProfile(false);
            } finally {
                setLoading(false);
            }
        };

        checkProfile();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!hasProfile) {
        return <Navigate to="/patient/register" />;
    }

    return children;
};

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
                                <PatientRegistration />
                            </PrivateRoute>
                        } 
                    />
                    // In App.js, add the route
<Route 
    path="/doctor/register" 
    element={
        <PrivateRoute>
            <DoctorRegistration />
        </PrivateRoute>
    } 
/>
                    <Route 
                        path="/patient" 
                        element={
                            <PrivateRoute>
                                <PatientDashboardGuard>
                                    <PatientDashboard />
                                </PatientDashboardGuard>
                            </PrivateRoute>
                        } 
                    />

                    {/* Doctor Routes */}
                    <Route 
                        path="/doctor" 
                        element={
                            <PrivateRoute>
                                <DoctorDashboard />
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
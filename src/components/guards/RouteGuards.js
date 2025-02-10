// src/components/guards/RouteGuards.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Loading Spinner Component
const LoadingSpinner = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
);

// Protected Route Component
export const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    
    if (loading) {
        return <LoadingSpinner />;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return children;
};

// Role Guard Component
export const RoleGuard = ({ children, allowedRole }) => {
    const { user } = useAuth();

    if (user?.role !== allowedRole) {
        return <Navigate to="/role-selection" />;
    }

    return children;
};

// Doctor Dashboard Guard
export const DoctorDashboardGuard = ({ children }) => {
    const { user } = useAuth();
    const [hasProfile, setHasProfile] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const checkProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${process.env.REACT_APP_API_URL}api/doctor/profile`, {
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
        return <LoadingSpinner />;
    }

    if (!hasProfile) {
        return <Navigate to="/doctor/register" />;
    }

    return children;
};

// Patient Dashboard Guard
export const PatientDashboardGuard = ({ children }) => {
    const { user } = useAuth();
    const [hasProfile, setHasProfile] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const checkProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${process.env.REACT_APP_API_URL}api/patient/profile`, {
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
        return <LoadingSpinner />;
    }

    if (!hasProfile) {
        return <Navigate to="/patient/register" />;
    }

    return children;
};
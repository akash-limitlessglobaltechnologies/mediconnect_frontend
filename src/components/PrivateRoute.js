import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, allowedRole }) => {
    const { user, loading, isAuthenticated } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    // Create a single source of truth for redirect logic
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Only redirect to role selection if authenticated but no role
    if (!user?.role && location.pathname !== '/role-selection') {
        return <Navigate to="/role-selection" state={{ from: location }} replace />;
    }

    // Check for specific role access if provided
    if (allowedRole && user.role !== allowedRole) {
        return <Navigate to={`/${user.role}`} replace />;
    }

    return children;
};

export default PrivateRoute;
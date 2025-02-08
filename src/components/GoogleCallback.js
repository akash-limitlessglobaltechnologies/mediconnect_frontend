// components/GoogleCallback.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function GoogleCallback() {
    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const params = new URLSearchParams(window.location.search);
                const token = params.get('token');

                if (!token) {
                    console.error('No token received');
                    navigate('/login');
                    return;
                }

                console.log('Received token:', token);
                const result = await login(token);
                console.log('Login result:', result);

                if (result.success) {
                    // Get user data from local storage
                    const userData = JSON.parse(localStorage.getItem('user'));
                    
                    if (!userData.role) {
                        // If user has no role, redirect to role selection
                        navigate('/role-selection');
                    } else {
                        // If user has a role, redirect to appropriate dashboard
                        switch (userData.role) {
                            case 'doctor':
                                navigate('/doctor');
                                break;
                            case 'patient':
                                navigate('/patient');
                                break;
                            default:
                                navigate('/login');
                        }
                    }
                } else {
                    navigate('/login');
                }
            } catch (error) {
                console.error('Callback error:', error);
                navigate('/login');
            }
        };

        handleCallback();
    }, [login, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                <p className="mt-4 text-gray-600">Processing your login...</p>
            </div>
        </div>
    );
}

export default GoogleCallback;
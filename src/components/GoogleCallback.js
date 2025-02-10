// components/GoogleCallback.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function GoogleCallback() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [hasProcessed, setHasProcessed] = useState(false);

    useEffect(() => {
        if (hasProcessed) return;

        const handleCallback = async () => {
            const params = new URLSearchParams(window.location.search);
            const token = params.get('token');

            if (!token) {
                navigate('/login', { replace: true });
                return;
            }

            try {
                const result = await login(token);
                if (result.success) {
                    navigate(result.redirectTo, { replace: true });
                } else {
                    navigate('/login', { replace: true });
                }
            } catch {
                navigate('/login', { replace: true });
            } finally {
                setHasProcessed(true);
            }
        };

        handleCallback();
    }, [login, navigate, hasProcessed]);

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
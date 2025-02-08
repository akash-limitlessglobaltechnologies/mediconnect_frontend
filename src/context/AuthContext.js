import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Function to validate token
    const isTokenValid = useCallback((token) => {
        try {
            const decodedToken = jwtDecode(token);
            return decodedToken.exp * 1000 > Date.now();
        } catch (error) {
            console.error('Token validation error:', error);
            return false;
        }
    }, []);

    // Check auth status on mount
    useEffect(() => {
        const validateAuth = async () => {
            try {
                const token = localStorage.getItem('token');
                
                if (token && isTokenValid(token)) {
                    // Get stored user data
                    const storedUser = localStorage.getItem('user');
                    if (storedUser) {
                        setUser(JSON.parse(storedUser));
                    } else {
                        // If no stored user data, decode from token
                        const decodedToken = jwtDecode(token);
                        const userData = {
                            id: decodedToken.id,
                            email: decodedToken.email,
                            role: decodedToken.role,
                            name: decodedToken.name
                        };
                        setUser(userData);
                        localStorage.setItem('user', JSON.stringify(userData));
                    }
                } else {
                    // Clear invalid auth data
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setUser(null);
                }
            } catch (error) {
                console.error('Auth validation error:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        validateAuth();
    }, [isTokenValid]);

    // Login handler
    // context/AuthContext.js
const login = useCallback(async (token) => {
    try {
        if (!token || typeof token !== 'string') {
            console.error('Invalid token format:', token);
            return { success: false };
        }

        const decodedToken = jwtDecode(token);
        
        if (!decodedToken || !decodedToken.id) {
            console.error('Invalid token content:', decodedToken);
            return { success: false };
        }
        
        // Store token
        localStorage.setItem('token', token);
        
        // Get full user data from token
        const userData = {
            id: decodedToken.id,
            email: decodedToken.email,
            role: decodedToken.role,
            name: decodedToken.name
        };
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));

        return {
            success: true,
            shouldRedirect: !userData.role,
            redirectTo: userData.role ? `/${userData.role}` : '/role-selection'
        };
    } catch (error) {
        console.error('Login error:', error);
        return { success: false };
    }
}, []);

    // Logout handler
   // In your AuthContext.js
const logout = useCallback(async () => {
    try {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return true;
    } catch (error) {
        console.error('Logout error:', error);
        return false;
    }
}, []);

    // Update role handler
   // context/AuthContext.js
const updateRole = useCallback(async (role) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5001/api/update-role', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ role })
        });

        const data = await response.json();

        if (data.success) {
            // Update stored token and user data
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
            
            return { 
                success: true, 
                redirectTo: `/${role}` 
            };
        } else {
            console.error('Role update failed:', data.message);
            return { success: false };
        }
    } catch (error) {
        console.error('Role update error:', error);
        return { success: false };
    }
}, []);
    // Get current auth status
    const getAuthStatus = useCallback(() => {
        const token = localStorage.getItem('token');
        return {
            isAuthenticated: !!user && !!token && isTokenValid(token),
            hasRole: !!user?.role,
            role: user?.role
        };
    }, [user, isTokenValid]);

    const value = {
        user,
        loading,
        login,
        logout,
        updateRole,
        getAuthStatus,
        isAuthenticated: !!user,
        hasRole: !!user?.role
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
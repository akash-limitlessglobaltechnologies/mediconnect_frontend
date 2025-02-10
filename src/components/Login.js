// src/components/Login.js
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Stethoscope, Activity, Users, Calendar, Shield } from 'lucide-react';

function Login() {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    React.useEffect(() => {
        // Check both authentication and user role
        if (isAuthenticated && user?.role) {
            navigate(`/${user.role}`, { replace: true });
        }
    }, [isAuthenticated, user, navigate]);

    const handleGoogleLogin = () => {
        window.location.href = `${process.env.REACT_APP_API_URL}auth/google`;
    };

    // Remove handleLoginSuccess as it's not being used

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            {/* Navigation Bar */}
            <nav className="bg-white/80 backdrop-blur-md shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20">
                        <div className="flex items-center space-x-4">
                            {/* Logo Section */}
                            <div className="relative">
                                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-30"></div>
                                <div className="relative bg-white rounded-full p-2">
                                    <svg className="h-10 w-10" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M25 10C25 7.23858 27.2386 5 30 5H35C37.7614 5 40 7.23858 40 10V15C40 17.7614 37.7614 20 35 20H30C27.2386 20 25 17.7614 25 15V10Z" fill="#4F46E5"/>
                                        <path d="M32.5 20V35C32.5 41.6274 27.1274 47 20.5 47C13.8726 47 8.5 41.6274 8.5 35C8.5 28.3726 13.8726 23 20.5 23" stroke="#4F46E5" strokeWidth="3" strokeLinecap="round"/>
                                        <circle cx="32.5" cy="12.5" r="2.5" fill="white"/>
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    MediConnect
                                </span>
                                <span className="block text-xs text-gray-500">Healthcare Excellence</span>
                            </div>
                        </div>
                        
                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            <button className="group flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors">
                                <Users className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                <span>About Us</span>
                            </button>
                            <button className="group flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors">
                                <Activity className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                <span>Services</span>
                            </button>
                            <button className="group flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors">
                                <Calendar className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                <span>Contact</span>
                            </button>
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="text-gray-600 hover:text-gray-900 focus:outline-none"
                            >
                                {isMenuOpen ? (
                                    <X className="h-6 w-6" />
                                ) : (
                                    <Menu className="h-6 w-6" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden bg-white/95 backdrop-blur-md">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            <button className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 w-full text-left">
                                <Users className="h-5 w-5" />
                                <span>About Us</span>
                            </button>
                            <button className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 w-full text-left">
                                <Activity className="h-5 w-5" />
                                <span>Services</span>
                            </button>
                            <button className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 w-full text-left">
                                <Calendar className="h-5 w-5" />
                                <span>Contact</span>
                            </button>
                        </div>
                    </div>
                )}
            </nav>

            {/* Login Section */}
            <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] px-4 py-12">
                <div className="max-w-md w-full">
                    <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-20"></div>
                        
                        <div className="relative bg-white shadow-xl rounded-2xl p-8">
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                                <div className="relative">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-30"></div>
                                    <div className="relative bg-white rounded-full p-4 shadow-lg">
                                        <Stethoscope className="h-12 w-12 text-indigo-600" />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 text-center">
                                <h2 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    Welcome Back
                                </h2>
                                <p className="mt-2 text-gray-600">
                                    Access your healthcare dashboard
                                </p>
                            </div>

                            {/* Feature Highlights */}
                            <div className="mt-8 grid grid-cols-2 gap-4">
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                    <Shield className="h-4 w-4 text-indigo-600" />
                                    <span>Secure Platform</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                    <Activity className="h-4 w-4 text-indigo-600" />
                                    <span>24/7 Care</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                    <Calendar className="h-4 w-4 text-indigo-600" />
                                    <span>Easy Scheduling</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                    <Users className="h-4 w-4 text-indigo-600" />
                                    <span>Expert Doctors</span>
                                </div>
                            </div>

                            <div className="mt-8 space-y-6">
                                <div className="flex items-center justify-center">
                                    <div className="h-px bg-gray-200 w-full"></div>
                                    <span className="px-4 text-sm text-gray-500">Sign in with</span>
                                    <div className="h-px bg-gray-200 w-full"></div>
                                </div>

                                <button
                                    onClick={handleGoogleLogin}
                                    className="w-full group relative flex items-center justify-center gap-3 py-3 px-4 rounded-xl text-gray-700 bg-white border-2 border-gray-100 hover:border-indigo-600 hover:shadow-lg transition-all duration-200"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
                                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                    </svg>
                                    Continue with Google
                                </button>
                            </div>

                            <div className="mt-8 text-sm text-center space-y-4">
                                <p className="text-gray-600">
                                    By continuing, you agree to our{' '}
                                    <button className="text-indigo-600 hover:text-indigo-500">
                                        Terms
                                    </button>{' '}
                                    and{' '}
                                    <button className="text-indigo-600 hover:text-indigo-500">
                                        Privacy Policy
                                    </button>
                                </p>
                                <p className="text-gray-500">
                                    Need assistance?{' '}
                                    <button className="text-indigo-600 hover:text-indigo-500">
                                        Contact Support
                                    </button>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
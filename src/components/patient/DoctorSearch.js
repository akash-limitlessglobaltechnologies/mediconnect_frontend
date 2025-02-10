import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ArrowLeft, Star, MapPin, Clock, X } from 'lucide-react';

const Alert = ({ children, variant = 'error' }) => {
    const baseStyles = "p-4 rounded-lg mb-4 flex items-center";
    const variantStyles = {
        error: "bg-red-50 text-red-700",
        success: "bg-green-50 text-green-700",
        warning: "bg-yellow-50 text-yellow-700",
        info: "bg-blue-50 text-blue-700"
    };
    return (
        <div className={`${baseStyles} ${variantStyles[variant]}`}>
            {children}
        </div>
    );
};

const DoctorSearch = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [availableFilters, setAvailableFilters] = useState({
        specializations: [],
        cities: []
    });
    const [filters, setFilters] = useState({
        name: '',
        specialization: '',
        city: ''
    });

    const fetchDoctors = async () => {
        try {
            setLoading(true);
            setError(null);

            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString()
            });

            if (filters.name) queryParams.append('name', filters.name);
            if (filters.specialization) queryParams.append('specialization', filters.specialization);
            if (filters.city) queryParams.append('city', filters.city);

            const response = await fetch(`${process.env.REACT_APP_API_URL}api/doctor/list?${queryParams}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch doctors');
                } else {
                    const text = await response.text();
                    console.error('Server response:', text);
                    throw new Error(`Server error: ${response.status}`);
                }
            }

            const data = await response.json();
            
            if (data.success) {
                setDoctors(data.data.doctors || []);
                setTotalPages(Math.ceil((data.data.pagination?.total || 0) / limit));
                updateAvailableFilters(data.data.doctors || []);
            } else {
                throw new Error(data.message || 'Failed to fetch doctors');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setError(error.message || 'Failed to fetch doctors. Please try again.');
            setDoctors([]);
        } finally {
            setLoading(false);
        }
    };

    const updateAvailableFilters = (doctorsList) => {
        const specializations = [...new Set(doctorsList.map(doc => 
            doc.professionalInfo?.specialization).filter(Boolean))];
        const cities = [...new Set(doctorsList.map(doc => 
            doc.personalInfo?.city).filter(Boolean))];
        
        setAvailableFilters({
            specializations,
            cities
        });
    };

    useEffect(() => {
        fetchDoctors();
    }, [page, filters]);

    const handleFilterChange = (name, value) => {
        setFilters(prev => ({ ...prev, [name]: value }));
        setPage(1);
    };

    const resetFilters = () => {
        setFilters({
            name: '',
            specialization: '',
            city: ''
        });
        setPage(1);
    };

    const handleBookAppointment = (doctorId) => {
        navigate(`/patient/doctor/${doctorId}`);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <button
                                onClick={() => navigate(-1)}
                                className="flex items-center text-gray-600 hover:text-indigo-600"
                            >
                                <ArrowLeft className="h-5 w-5 mr-2" />
                                Back
                            </button>
                            <h1 className="text-2xl font-bold text-gray-900 ml-4">Find Doctors</h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Search Bar */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search by doctor's name"
                                className="w-full border rounded-lg p-2 pl-8"
                                value={filters.name}
                                onChange={(e) => handleFilterChange('name', e.target.value)}
                            />
                            <Search className="w-4 h-4 absolute left-2 top-3 text-gray-400" />
                        </div>
                        <select
                            className="border rounded-lg p-2"
                            value={filters.specialization}
                            onChange={(e) => handleFilterChange('specialization', e.target.value)}
                        >
                            <option value="">All Specializations</option>
                            {availableFilters.specializations.map(spec => (
                                <option key={spec} value={spec}>{spec}</option>
                            ))}
                        </select>
                        <select
                            className="border rounded-lg p-2"
                            value={filters.city}
                            onChange={(e) => handleFilterChange('city', e.target.value)}
                        >
                            <option value="">All Cities</option>
                            {availableFilters.cities.map(city => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                        <button
                            onClick={resetFilters}
                            className="bg-indigo-600 text-white rounded-lg p-2 flex items-center justify-center hover:bg-indigo-700"
                        >
                            <Filter className="w-5 h-5 mr-2" />
                            Reset Filters
                        </button>
                    </div>
                </div>

                {error && (
                    <Alert variant="error">
                        <X className="w-5 h-5 mr-2" />
                        {error}
                    </Alert>
                )}

                {/* Doctor List */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {doctors.map((doctor) => (
                                <div key={doctor._id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold">
                                                Dr. {doctor.personalInfo.fullName}
                                            </h3>
                                            <p className="text-indigo-600 font-medium">
                                                {doctor.professionalInfo.specialization}
                                            </p>
                                            <div className="flex items-center mt-2 text-gray-600">
                                                <MapPin className="w-4 h-4 mr-1" />
                                                <span className="text-sm">{doctor.personalInfo.city}</span>
                                            </div>
                                            <div className="flex items-center mt-1 text-gray-600">
                                                <Clock className="w-4 h-4 mr-1" />
                                                <span className="text-sm">
                                                    {doctor.professionalInfo.experience} years experience
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-semibold text-gray-900">
                                                ₹{doctor.pricing.consultationFee}
                                            </p>
                                            <div className="flex items-center mt-1 justify-end">
                                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                <span className="ml-1 text-sm">
                                                    {doctor.ratings?.average?.toFixed(1) || 'New'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {doctor.availability?.days?.length > 0 && (
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {doctor.availability.days.map((day) => (
                                                <span key={day} className="px-2 py-1 bg-indigo-50 text-indigo-700 text-sm rounded">
                                                    {day}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <button
                                        onClick={() => handleBookAppointment(doctor._id)}
                                        className="mt-4 w-full bg-indigo-600 text-white rounded-lg py-2 hover:bg-indigo-700 transition-colors"
                                    >
                                        View Profile & Book
                                    </button>
                                </div>
                            ))}

                            {doctors.length === 0 && !loading && (
                                <div className="col-span-full text-center py-12 text-gray-500">
                                    No doctors found matching your criteria
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-8 flex justify-center gap-2">
                                <button
                                    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                                    disabled={page === 1}
                                    className={`px-4 py-2 rounded-lg ${
                                        page === 1
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-white text-gray-700 hover:bg-gray-50'
                                    } border`}
                                >
                                    Previous
                                </button>
                                {[...Array(totalPages)].map((_, index) => (
                                    <button
                                        key={index + 1}
                                        onClick={() => setPage(index + 1)}
                                        className={`px-4 py-2 rounded-lg ${
                                            page === index + 1
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-white text-gray-700 hover:bg-gray-50'
                                        } border`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={page === totalPages}
                                    className={`px-4 py-2 rounded-lg ${
                                        page === totalPages
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-white text-gray-700 hover:bg-gray-50'
                                    } border`}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default DoctorSearch;
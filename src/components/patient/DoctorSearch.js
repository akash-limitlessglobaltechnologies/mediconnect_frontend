// components/patient/DoctorSearch.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';

const DoctorSearch = () => {
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        specialization: '',
        name: '',
        city: '',
        availability: ''
    });

    const handleSearch = async () => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams(filters).toString();
            const response = await fetch(`/api/doctors/search?${queryParams}`);
            const data = await response.json();
            
            if (data.success) {
                setDoctors(data.data.doctors);
            }
        } catch (error) {
            console.error('Error searching doctors:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Search Filters */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input
                        type="text"
                        placeholder="Doctor's Name"
                        className="border rounded-lg p-2"
                        value={filters.name}
                        onChange={(e) => setFilters({...filters, name: e.target.value})}
                    />
                    <input
                        type="text"
                        placeholder="Specialization"
                        className="border rounded-lg p-2"
                        value={filters.specialization}
                        onChange={(e) => setFilters({...filters, specialization: e.target.value})}
                    />
                    <input
                        type="text"
                        placeholder="City"
                        className="border rounded-lg p-2"
                        value={filters.city}
                        onChange={(e) => setFilters({...filters, city: e.target.value})}
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-indigo-600 text-white rounded-lg p-2 flex items-center justify-center"
                    >
                        <Search className="w-5 h-5 mr-2" />
                        Search
                    </button>
                </div>
            </div>

            {/* Doctor List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div>Loading...</div>
                ) : doctors.map((doctor) => (
                    <div key={doctor._id} className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-lg font-semibold">
                                    Dr. {doctor.personalInfo.fullName}
                                </h3>
                                <p className="text-gray-600">
                                    {doctor.professionalInfo.specialization}
                                </p>
                                <p className="text-gray-500 text-sm">
                                    {doctor.personalInfo.city}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-semibold">
                                    ₹{doctor.pricing.consultationFee}
                                </p>
                                <div className="flex items-center mt-1">
                                    <span className="text-yellow-400">⭐</span>
                                    <span className="ml-1">{doctor.ratings.average.toFixed(1)}</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate(`/patient/doctor/${doctor._id}`)}
                            className="mt-4 w-full bg-indigo-600 text-white rounded-lg py-2"
                        >
                            View Profile
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DoctorSearch;
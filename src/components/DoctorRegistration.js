import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    User,
    Briefcase,
    Star,
    DollarSign,
    FileText,
    ChevronRight,
    ChevronLeft,
    Plus,
    X
} from 'lucide-react';

const formVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
};

const DoctorRegistration = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        personalInfo: {
            fullName: '',
            dateOfBirth: '',
            gender: '',
            contactNumber: '',
            address: ''
        },
        professionalInfo: {
            specialization: '',
            licenseNumber: '',
            experience: '',
            qualification: [{ degree: '', institution: '', year: '' }],
            currentPractice: ''
        },
        expertise: [''],
        pricing: {
            consultationFee: '',
            currency: 'USD'
        },
        bio: '',
        portfolio: [{ title: '', description: '', link: '' }],
        availability: {
            days: [],
            timeSlots: [{ startTime: '', endTime: '' }]
        }
    });

    const specializations = [
        "Cardiology", "Dermatology", "Endocrinology",
        "Family Medicine", "Gastroenterology", "Neurology",
        "Oncology", "Pediatrics", "Psychiatry", "Surgery"
    ];

    const weekDays = [
        "Monday", "Tuesday", "Wednesday", "Thursday",
        "Friday", "Saturday", "Sunday"
    ];

    const handleInputChange = (section, field, value, index = null) => {
        setFormData(prev => {
            const newData = { ...prev };
            if (index !== null) {
                if (section === 'professionalInfo' && field === 'qualification') {
                    newData.professionalInfo.qualification[index] = {
                        ...newData.professionalInfo.qualification[index],
                        ...value
                    };
                } else if (section === 'portfolio') {
                    newData.portfolio[index] = {
                        ...newData.portfolio[index],
                        ...value
                    };
                } else if (Array.isArray(newData[section])) {
                    newData[section][index] = value;
                }
            } else if (section === 'personalInfo' || section === 'professionalInfo' || section === 'pricing') {
                newData[section] = {
                    ...newData[section],
                    [field]: value
                };
            } else {
                newData[section] = value;
            }
            return newData;
        });
    };

    const addArrayField = (section, defaultValue = '') => {
        setFormData(prev => ({
            ...prev,
            [section]: Array.isArray(prev[section]) ? 
                [...prev[section], defaultValue] :
                [...prev[section].qualification, { degree: '', institution: '', year: '' }]
        }));
    };

    const removeArrayField = (section, index) => {
        setFormData(prev => ({
            ...prev,
            [section]: Array.isArray(prev[section]) ?
                prev[section].filter((_, i) => i !== index) :
                {
                    ...prev[section],
                    qualification: prev[section].qualification.filter((_, i) => i !== index)
                }
        }));
    };

    const toggleDay = (day) => {
        setFormData(prev => ({
            ...prev,
            availability: {
                ...prev.availability,
                days: prev.availability.days.includes(day)
                    ? prev.availability.days.filter(d => d !== day)
                    : [...prev.availability.days, day]
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (currentStep < steps.length) {
            setCurrentStep(prev => prev + 1);
            return;
        }

        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/doctor/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                navigate('/doctor/dashboard');
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (err) {
            setError('An error occurred during registration');
            console.error('Registration error:', err);
        } finally {
            setLoading(false);
        }
    };

    const renderPersonalInfo = () => (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                    type="text"
                    value={formData.personalInfo.fullName}
                    onChange={(e) => handleInputChange('personalInfo', 'fullName', e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    required
                />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                    <input
                        type="date"
                        value={formData.personalInfo.dateOfBirth}
                        onChange={(e) => handleInputChange('personalInfo', 'dateOfBirth', e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                    <select
                        value={formData.personalInfo.gender}
                        onChange={(e) => handleInputChange('personalInfo', 'gender', e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        required
                    >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                <input
                    type="tel"
                    value={formData.personalInfo.contactNumber}
                    onChange={(e) => handleInputChange('personalInfo', 'contactNumber', e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <textarea
                    value={formData.personalInfo.address}
                    onChange={(e) => handleInputChange('personalInfo', 'address', e.target.value)}
                    rows="3"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    required
                />
            </div>
        </div>
    );

    const renderProfessionalInfo = () => (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700">Specialization</label>
                <select
                    value={formData.professionalInfo.specialization}
                    onChange={(e) => handleInputChange('professionalInfo', 'specialization', e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    required
                >
                    <option value="">Select Specialization</option>
                    {specializations.map(spec => (
                        <option key={spec} value={spec}>{spec}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">License Number</label>
                <input
                    type="text"
                    value={formData.professionalInfo.licenseNumber}
                    onChange={(e) => handleInputChange('professionalInfo', 'licenseNumber', e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Years of Experience</label>
                <input
                    type="number"
                    value={formData.professionalInfo.experience}
                    onChange={(e) => handleInputChange('professionalInfo', 'experience', e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    required
                    min="0"
                />
            </div>

            <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Qualifications</label>
                    <button
                        type="button"
                        onClick={() => addArrayField('professionalInfo')}
                        className="flex items-center text-sm text-indigo-600 hover:text-indigo-700"
                    >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Qualification
                    </button>
                </div>
                {formData.professionalInfo.qualification.map((qual, index) => (
                    <div key={index} className="flex gap-4 mb-4">
                        <input
                            type="text"
                            placeholder="Degree"
                            value={qual.degree}
                            onChange={(e) => handleInputChange('professionalInfo', 'qualification', { degree: e.target.value }, index)}
                            className="flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                        <input
                            type="text"
                            placeholder="Institution"
                            value={qual.institution}
                            onChange={(e) => handleInputChange('professionalInfo', 'qualification', { institution: e.target.value }, index)}
                            className="flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                        <input
                            type="number"
                            placeholder="Year"
                            value={qual.year}
                            onChange={(e) => handleInputChange('professionalInfo', 'qualification', { year: e.target.value }, index)}
                            className="w-24 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                        {index > 0 && (
                            <button
                                type="button"
                                onClick={() => removeArrayField('professionalInfo', index)}
                                className="text-red-600 hover:text-red-700"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    const renderExpertise = () => (
        <div className="space-y-6">
            <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Areas of Expertise</label>
                    <button
                        type="button"
                        onClick={() => addArrayField('expertise')}
                        className="flex items-center text-sm text-indigo-600 hover:text-indigo-700"
                    >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Expertise
                    </button>
                </div>
                {formData.expertise.map((exp, index) => (
                    <div key={index} className="flex gap-4 mb-4">
                        <input
                            type="text"
                            value={exp}
                            onChange={(e) => handleInputChange('expertise', null, e.target.value, index)}
                            className="flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            placeholder="Enter area of expertise"
                        />
                        {index > 0 && (
                            <button
                                type="button"
                                onClick={() => removeArrayField('expertise', index)}
                                className="text-red-600 hover:text-red-700"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    const renderPricingAvailability = () => (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700">Consultation Fee</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                        type="number"
                        value={formData.pricing.consultationFee}
                        onChange={(e) => handleInputChange('pricing', 'consultationFee', e.target.value)}
                        className="block w-full pl-7 pr-12 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        required
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">USD</span>
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Available Days</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {weekDays.map((day) => (
                        <button
                            key={day}
                            type="button"
                            onClick={() => toggleDay(day)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                                ${formData.availability.days.includes(day)
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {day}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Time Slots</label>
                    <button
                        type="button"
                        onClick={() => setFormData(prev => ({
                            ...prev,
                            availability: {
                                ...prev.availability,
                                timeSlots: [...prev.availability.timeSlots, { startTime: '', endTime: '' }]
                            }
                        }))}
                        className="flex items-center text-sm text-indigo-600 hover:text-indigo-700"
                    >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Time Slot
                    </button>
                </div>
                {formData.availability.timeSlots.map((slot, index) => (
                    <div key={index} className="flex gap-4 mb-4">
                        <input
                            type="time"
                            value={slot.startTime}
                            onChange={(e) => {
                                const newTimeSlots = [...formData.availability.timeSlots];
                                newTimeSlots[index].startTime = e.target.value;
                                setFormData(prev => ({
                                    ...prev,
                                    availability: {
                                        ...prev.availability,
                                        timeSlots: newTimeSlots
                                    }
                                }));
                            }}
                            className="flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            required
                        />
                        <span className="flex items-center">to</span>
                        <input
                            type="time"
                            value={slot.endTime}
                            onChange={(e) => {
                                const newTimeSlots = [...formData.availability.timeSlots];
                                newTimeSlots[index].endTime = e.target.value;
                                setFormData(prev => ({
                                    ...prev,
                                    availability: {
                                        ...prev.availability,
                                        timeSlots: newTimeSlots
                                    }
                                }));
                            }}
                            className="flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            required
                        />
                        {index > 0 && (
                            <button
                                type="button"
                                onClick={() => {
                                    setFormData(prev => ({
                                        ...prev,
                                        availability: {
                                            ...prev.availability,
                                            timeSlots: prev.availability.timeSlots.filter((_, i) => i !== index)
                                        }
                                    }));
                                }}
                                className="text-red-600 hover:text-red-700"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    const renderBioPortfolio = () => (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700">Professional Bio</label>
                <textarea
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', null, e.target.value)}
                    rows="4"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="Write a brief professional bio..."
                    required
                />
            </div>

            <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Portfolio Items</label>
                    <button
                        type="button"
                        onClick={() => addArrayField('portfolio', { title: '', description: '', link: '' })}
                        className="flex items-center text-sm text-indigo-600 hover:text-indigo-700"
                    >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Portfolio Item
                    </button>
                </div>
                {formData.portfolio.map((item, index) => (
                    <div key={index} className="space-y-4 mb-6 p-4 border border-gray-200 rounded-md">
                        <div>
                            <input
                                type="text"
                                placeholder="Title"
                                value={item.title}
                                onChange={(e) => handleInputChange('portfolio', null, { title: e.target.value }, index)}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <textarea
                                placeholder="Description"
                                value={item.description}
                                onChange={(e) => handleInputChange('portfolio', null, { description: e.target.value }, index)}
                                rows="2"
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <input
                                type="url"
                                placeholder="Link (optional)"
                                value={item.link}
                                onChange={(e) => handleInputChange('portfolio', null, { link: e.target.value }, index)}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>
                        {index > 0 && (
                            <button
                                type="button"
                                onClick={() => removeArrayField('portfolio', index)}
                                className="text-red-600 hover:text-red-700"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    const steps = [
        {
            title: "Personal Information",
            icon: User,
            content: renderPersonalInfo
        },
        {
            title: "Professional Information",
            icon: Briefcase,
            content: renderProfessionalInfo
        },
        {
            title: "Expertise & Skills",
            icon: Star,
            content: renderExpertise
        },
        {
            title: "Pricing & Availability",
            icon: DollarSign,
            content: renderPricingAvailability
        },
        {
            title: "Bio & Portfolio",
            icon: FileText,
            content: renderBioPortfolio
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                    <div className="px-6 py-8">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900">
                                Complete Your Doctor Profile
                            </h2>
                            <p className="mt-2 text-gray-600">
                                Step {currentStep} of {steps.length}
                            </p>
                        </div>

                        {error && (
                            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="transition-all duration-300">
                                {steps[currentStep - 1].content()}
                            </div>

                            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                                {currentStep > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => setCurrentStep(curr => curr - 1)}
                                        className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                                    >
                                        <ChevronLeft className="w-4 h-4 mr-1" />
                                        Previous
                                    </button>
                                )}
                                
                                <button
                                    type={currentStep === steps.length ? "submit" : "button"}
                                    onClick={currentStep === steps.length ? undefined : () => setCurrentStep(curr => curr + 1)}
                                    className={`ml-auto flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                                    ) : (
                                        <>
                                            {currentStep === steps.length ? 'Complete Registration' : 'Next'}
                                            <ChevronRight className="w-4 h-4 ml-1" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorRegistration;
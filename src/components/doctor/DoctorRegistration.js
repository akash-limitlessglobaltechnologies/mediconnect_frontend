// components/doctor/DoctorRegistration.jsx
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
  ChevronLeft
} from 'lucide-react';

// Import form components
import PersonalInfoForm from './PersonalInfoForm';
import ProfessionalInfoForm from './ProfessionalInfoForm';
import ExpertiseForm from './ExpertiseForm';
import AvailabilityForm from './AvailabilityForm';
import BioPortfolioForm from './BioPortfolioForm';

const formVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 }
};

const initialFormData = {
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
};

const DoctorRegistration = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState(initialFormData);

  // Generic input handler
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

  // Array field handlers
  const addArrayField = (section, defaultValue = '') => {
    setFormData(prev => ({
      ...prev,
      [section]: Array.isArray(prev[section]) ? 
        [...prev[section], defaultValue] :
        { 
          ...prev[section], 
          qualification: [...prev[section].qualification, { degree: '', institution: '', year: '' }] 
        }
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

  // Day toggle handler
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

  // Form submission
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
      const response = await fetch('http://localhost:5001/api/doctor/register', {
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

  const steps = [
    {
      title: "Personal Information",
      icon: User,
      component: <PersonalInfoForm formData={formData} handleInputChange={handleInputChange} />
    },
    {
      title: "Professional Information",
      icon: Briefcase,
      component: <ProfessionalInfoForm 
        formData={formData} 
        handleInputChange={handleInputChange}
        addArrayField={addArrayField}
        removeArrayField={removeArrayField}
      />
    },
    {
      title: "Expertise & Skills",
      icon: Star,
      component: <ExpertiseForm 
        formData={formData} 
        handleInputChange={handleInputChange}
        addArrayField={addArrayField}
        removeArrayField={removeArrayField}
      />
    },
    {
      title: "Pricing & Availability",
      icon: DollarSign,
      component: <AvailabilityForm 
        formData={formData}
        handleInputChange={handleInputChange}
        toggleDay={toggleDay}
        setFormData={setFormData}
      />
    },
    {
      title: "Bio & Portfolio",
      icon: FileText,
      component: <BioPortfolioForm 
        formData={formData}
        handleInputChange={handleInputChange}
        addArrayField={addArrayField}
        removeArrayField={removeArrayField}
      />
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

            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex justify-between items-center">
                {steps.map((step, index) => {
                  const StepIcon = step.icon;
                  return (
                    <div key={step.title} className="flex flex-col items-center">
                      <div 
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          index + 1 === currentStep
                            ? 'bg-indigo-600 text-white'
                            : index + 1 < currentStep
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        <StepIcon className="w-5 h-5" />
                      </div>
                      <span className="text-xs mt-2 hidden sm:block">{step.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <motion.div
                key={currentStep}
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="transition-all duration-300"
              >
                {steps[currentStep - 1].component}
              </motion.div>

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
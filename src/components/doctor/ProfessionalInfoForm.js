import React from 'react';
import { Plus, X } from 'lucide-react';

const ProfessionalInfoForm = ({ formData, handleInputChange, addArrayField, removeArrayField }) => {
  const specializations = [
    "Cardiology", "Dermatology", "Endocrinology",
    "Family Medicine", "Gastroenterology", "Neurology",
    "Oncology", "Pediatrics", "Psychiatry", "Surgery"
  ];

  return (
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
};

export default ProfessionalInfoForm;
import React from 'react';
import { Plus, X } from 'lucide-react';

const ExpertiseForm = ({ formData, handleInputChange, addArrayField, removeArrayField }) => {
  return (
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
};

export default ExpertiseForm;

import React from 'react';
import { Plus, X } from 'lucide-react';

const BioPortfolioForm = ({ formData, handleInputChange, addArrayField, removeArrayField }) => {
  return (
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
};

export default BioPortfolioForm;
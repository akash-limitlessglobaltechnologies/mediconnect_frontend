import React from 'react';
import { Plus, X } from 'lucide-react';

const AvailabilityForm = ({ formData, handleInputChange, toggleDay, setFormData }) => {
  const weekDays = [
    "Monday", "Tuesday", "Wednesday", "Thursday",
    "Friday", "Saturday", "Sunday"
  ];

  const addTimeSlot = () => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        timeSlots: [...prev.availability.timeSlots, { startTime: '', endTime: '' }]
      }
    }));
  };

  const removeTimeSlot = (index) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        timeSlots: prev.availability.timeSlots.filter((_, i) => i !== index)
      }
    }));
  };

  const updateTimeSlot = (index, field, value) => {
    const newTimeSlots = [...formData.availability.timeSlots];
    newTimeSlots[index] = {
      ...newTimeSlots[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        timeSlots: newTimeSlots
      }
    }));
  };

  return (
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
            onClick={addTimeSlot}
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
              onChange={(e) => updateTimeSlot(index, 'startTime', e.target.value)}
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            />
            <span className="flex items-center">to</span>
            <input
              type="time"
              value={slot.endTime}
              onChange={(e) => updateTimeSlot(index, 'endTime', e.target.value)}
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            />
            {index > 0 && (
              <button
                type="button"
                onClick={() => removeTimeSlot(index)}
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

export default AvailabilityForm;
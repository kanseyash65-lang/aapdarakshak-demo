// components/HelpRequestForm.jsx
import React, { useState } from 'react';
import { 
  XMarkIcon, 
  PhotoIcon,
  DocumentTextIcon,
  CurrencyRupeeIcon,
  MapPinIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const HelpRequestForm = ({ isOpen, onClose, user }) => {
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    urgency: 'medium',
    amount: '',
    location: '',
    contact: user?.phone || '',
    proofDocuments: []
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { id: 'medical', label: 'Medical Expenses', icon: '🏥' },
    { id: 'education', label: 'Education Support', icon: '📚' },
    { id: 'shelter', label: 'Shelter/Housing', icon: '🏠' },
    { id: 'food', label: 'Food Supplies', icon: '🍎' },
    { id: 'employment', label: 'Employment Help', icon: '💼' },
    { id: 'other', label: 'Other Support', icon: '🤝' }
  ];

  const urgencyLevels = [
    { id: 'low', label: 'Low (Within 1 week)', color: 'text-green-400' },
    { id: 'medium', label: 'Medium (Within 3 days)', color: 'text-yellow-400' },
    { id: 'high', label: 'High (Within 24 hours)', color: 'text-orange-400' },
    { id: 'critical', label: 'Critical (Immediate)', color: 'text-red-400' }
  ];

  if (!isOpen) return null;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    // Simulate file processing
    const newFiles = files.map(file => ({
      name: file.name,
      type: file.type,
      size: file.size,
      preview: URL.createObjectURL(file)
    }));
    setFormData(prev => ({
      ...prev,
      proofDocuments: [...prev.proofDocuments, ...newFiles]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      alert('Help request submitted successfully! Our community will review it soon.');
      setIsSubmitting(false);
      onClose();
      setFormData({
        category: '',
        title: '',
        description: '',
        urgency: 'medium',
        amount: '',
        location: '',
        contact: user?.phone || '',
        proofDocuments: []
      });
      setCurrentStep(1);
    }, 2000);
  };

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-3xl p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white z-10"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            Request Community Help
          </h2>
          <p className="text-gray-400 text-sm">
            Step {currentStep} of 3
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-xs text-gray-400">Category</span>
            <span className="text-xs text-gray-400">Details</span>
            <span className="text-xs text-gray-400">Review</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Step 1: Category Selection */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">
                What type of help do you need?
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                {categories.map(category => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => handleInputChange('category', category.id)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.category === category.id
                        ? 'border-blue-500 bg-blue-500/20'
                        : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                    }`}
                  >
                    <span className="text-2xl mb-2">{category.icon}</span>
                    <p className="text-sm text-white font-medium">{category.label}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Details */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">
                Tell us more about your situation
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title of your request *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Medical treatment for my father"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Please describe your situation in detail..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Urgency Level *
                </label>
                <select
                  value={formData.urgency}
                  onChange={(e) => handleInputChange('urgency', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {urgencyLevels.map(level => (
                    <option key={level.id} value={level.id}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Amount Needed (₹)
                </label>
                <div className="relative">
                  <CurrencyRupeeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    placeholder="Enter amount if applicable"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Additional Info & Review */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">
                Additional Information
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <MapPinIcon className="w-4 h-4 inline mr-1" />
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Enter your location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <DocumentTextIcon className="w-4 h-4 inline mr-1" />
                  Supporting Documents (Optional)
                </label>
                <label className="flex items-center justify-center p-4 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer hover:border-gray-500 transition-colors">
                  <PhotoIcon className="w-6 h-6 text-gray-400 mr-2" />
                  <span className="text-gray-400">Upload photos or documents</span>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx"
                  />
                </label>
                
                {formData.proofDocuments.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {formData.proofDocuments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-700 p-2 rounded">
                        <span className="text-sm text-gray-300 truncate">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => handleInputChange('proofDocuments', formData.proofDocuments.filter((_, i) => i !== index))}
                          className="text-red-400 hover:text-red-300"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Review Summary */}
              <div className="bg-gray-700/50 rounded-xl p-4 mt-6">
                <h4 className="font-semibold text-white mb-3">Request Summary</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-400">Category:</span> {categories.find(c => c.id === formData.category)?.label}</p>
                  <p><span className="text-gray-400">Title:</span> {formData.title}</p>
                  <p><span className="text-gray-400">Urgency:</span> {urgencyLevels.find(u => u.id === formData.urgency)?.label}</p>
                  {formData.amount && <p><span className="text-gray-400">Amount:</span> ₹{formData.amount}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex space-x-3 pt-6">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                Back
              </button>
            )}
            
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={currentStep === 1 && !formData.category}
                className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting || !formData.title || !formData.description}
                className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default HelpRequestForm;
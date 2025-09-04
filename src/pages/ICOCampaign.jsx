import React, { useState } from 'react';
import { useToken } from '../contexts/TokenContext';
import { Calendar, DollarSign, Target, Clock } from 'lucide-react';

const ICOCampaign = () => {
  const { tokens, addCampaign, campaigns } = useToken();
  const [formData, setFormData] = useState({
    tokenId: '',
    startDate: '',
    endDate: '',
    fundraisingGoal: '',
    tokenPrice: '',
    cap: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.tokenId) {
      newErrors.tokenId = 'Please select a token';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    } else if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      newErrors.endDate = 'End date must be after start date';
    }

    if (!formData.fundraisingGoal || parseFloat(formData.fundraisingGoal) <= 0) {
      newErrors.fundraisingGoal = 'Fundraising goal must be greater than 0';
    }

    if (!formData.tokenPrice || parseFloat(formData.tokenPrice) <= 0) {
      newErrors.tokenPrice = 'Token price must be greater than 0';
    }

    if (!formData.cap || parseFloat(formData.cap) <= 0) {
      newErrors.cap = 'Cap must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      addCampaign(formData);
      setIsSubmitting(false);
      setFormData({
        tokenId: '',
        startDate: '',
        endDate: '',
        fundraisingGoal: '',
        tokenPrice: '',
        cap: ''
      });
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="card-gradient rounded-lg p-6">
        <h2 className="text-2xl font-bold text-dark-text mb-2">Create ICO Campaign</h2>
        <p className="text-dark-muted">
          Set up your Initial Coin Offering parameters to start raising funds for your project.
        </p>
      </div>

      {/* Campaign Form */}
      <div className="card-gradient rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Token Selection */}
          <div>
            <label className="block text-sm font-medium text-dark-text mb-2">
              Select Token
            </label>
            <select
              value={formData.tokenId}
              onChange={(e) => handleInputChange('tokenId', e.target.value)}
              className={`w-full px-4 py-3 bg-dark-card border rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.tokenId ? 'border-red-500' : 'border-gray-600'
              }`}
            >
              <option value="">Choose a token...</option>
              {tokens.map((token) => (
                <option key={token.tokenId} value={token.tokenId}>
                  {token.tokenName} ({token.tokenSymbol}) - {token.blockchainNetwork}
                </option>
              ))}
            </select>
            {errors.tokenId && (
              <p className="text-red-400 text-sm mt-1">{errors.tokenId}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-dark-text mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Start Date
              </label>
              <input
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className={`w-full px-4 py-3 bg-dark-card border rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.startDate ? 'border-red-500' : 'border-gray-600'
                }`}
              />
              {errors.startDate && (
                <p className="text-red-400 text-sm mt-1">{errors.startDate}</p>
              )}
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-dark-text mb-2">
                <Clock className="w-4 h-4 inline mr-2" />
                End Date
              </label>
              <input
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                className={`w-full px-4 py-3 bg-dark-card border rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.endDate ? 'border-red-500' : 'border-gray-600'
                }`}
              />
              {errors.endDate && (
                <p className="text-red-400 text-sm mt-1">{errors.endDate}</p>
              )}
            </div>

            {/* Fundraising Goal */}
            <div>
              <label className="block text-sm font-medium text-dark-text mb-2">
                <Target className="w-4 h-4 inline mr-2" />
                Fundraising Goal (USD)
              </label>
              <input
                type="number"
                value={formData.fundraisingGoal}
                onChange={(e) => handleInputChange('fundraisingGoal', e.target.value)}
                placeholder="e.g., 500000"
                min="1"
                className={`w-full px-4 py-3 bg-dark-card border rounded-lg text-dark-text placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.fundraisingGoal ? 'border-red-500' : 'border-gray-600'
                }`}
              />
              {errors.fundraisingGoal && (
                <p className="text-red-400 text-sm mt-1">{errors.fundraisingGoal}</p>
              )}
            </div>

            {/* Token Price */}
            <div>
              <label className="block text-sm font-medium text-dark-text mb-2">
                <DollarSign className="w-4 h-4 inline mr-2" />
                Token Price (USD)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.tokenPrice}
                onChange={(e) => handleInputChange('tokenPrice', e.target.value)}
                placeholder="e.g., 0.10"
                min="0.01"
                className={`w-full px-4 py-3 bg-dark-card border rounded-lg text-dark-text placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.tokenPrice ? 'border-red-500' : 'border-gray-600'
                }`}
              />
              {errors.tokenPrice && (
                <p className="text-red-400 text-sm mt-1">{errors.tokenPrice}</p>
              )}
            </div>

            {/* Hard Cap */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-dark-text mb-2">
                Hard Cap (USD)
              </label>
              <input
                type="number"
                value={formData.cap}
                onChange={(e) => handleInputChange('cap', e.target.value)}
                placeholder="e.g., 1000000"
                min="1"
                className={`w-full px-4 py-3 bg-dark-card border rounded-lg text-dark-text placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.cap ? 'border-red-500' : 'border-gray-600'
                }`}
              />
              {errors.cap && (
                <p className="text-red-400 text-sm mt-1">{errors.cap}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating Campaign...' : 'Launch ICO Campaign'}
            </button>
          </div>
        </form>
      </div>

      {/* Active Campaigns */}
      {campaigns.length > 0 && (
        <div className="card-gradient rounded-lg p-6">
          <h3 className="text-lg font-semibold text-dark-text mb-4">Active Campaigns</h3>
          <div className="space-y-4">
            {campaigns.map((campaign) => {
              const token = tokens.find(t => t.tokenId === campaign.tokenId);
              const progress = (parseFloat(campaign.raised || 0) / parseFloat(campaign.fundraisingGoal)) * 100;
              
              return (
                <div key={campaign.campaignId} className="bg-dark-card rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-dark-text font-medium">{token?.tokenName}</h4>
                      <p className="text-dark-muted text-sm">{token?.tokenSymbol}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      campaign.currentState === 'active' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {campaign.currentState}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <p className="text-dark-muted text-xs">Raised</p>
                      <p className="text-dark-text font-medium">${parseFloat(campaign.raised || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-dark-muted text-xs">Goal</p>
                      <p className="text-dark-text font-medium">${parseFloat(campaign.fundraisingGoal).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-dark-muted text-xs">Token Price</p>
                      <p className="text-dark-text font-medium">${campaign.tokenPrice}</p>
                    </div>
                    <div>
                      <p className="text-dark-muted text-xs">End Date</p>
                      <p className="text-dark-text font-medium">{new Date(campaign.endDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="w-full bg-dark-bg rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-dark-muted text-sm mt-1">{progress.toFixed(1)}% of goal reached</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ICOCampaign;
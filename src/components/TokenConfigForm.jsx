import React, { useState } from 'react';
import { Coins, Hash, DollarSign, Globe } from 'lucide-react';

const TokenConfigForm = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    tokenName: '',
    tokenSymbol: '',
    decimals: 18,
    totalSupply: '',
    blockchainNetwork: 'ethereum'
  });

  const [errors, setErrors] = useState({});

  const networks = [
    { value: 'ethereum', label: 'Ethereum Mainnet', icon: '⟠' },
    { value: 'polygon', label: 'Polygon', icon: '⬢' },
    { value: 'base', label: 'Base', icon: '🔵' },
    { value: 'arbitrum', label: 'Arbitrum', icon: '🔺' },
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.tokenName.trim()) {
      newErrors.tokenName = 'Token name is required';
    }

    if (!formData.tokenSymbol.trim()) {
      newErrors.tokenSymbol = 'Token symbol is required';
    } else if (formData.tokenSymbol.length > 6) {
      newErrors.tokenSymbol = 'Symbol should be 6 characters or less';
    }

    if (!formData.totalSupply || parseFloat(formData.totalSupply) <= 0) {
      newErrors.totalSupply = 'Total supply must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onComplete(formData);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Token Name */}
        <div>
          <label className="block text-sm font-medium text-dark-text mb-2">
            <Coins className="w-4 h-4 inline mr-2" />
            Token Name
          </label>
          <input
            type="text"
            value={formData.tokenName}
            onChange={(e) => handleInputChange('tokenName', e.target.value)}
            placeholder="e.g., MyAwesomeToken"
            className={`w-full px-4 py-3 bg-dark-card border rounded-lg text-dark-text placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.tokenName ? 'border-red-500' : 'border-gray-600'
            }`}
          />
          {errors.tokenName && (
            <p className="text-red-400 text-sm mt-1">{errors.tokenName}</p>
          )}
        </div>

        {/* Token Symbol */}
        <div>
          <label className="block text-sm font-medium text-dark-text mb-2">
            <Hash className="w-4 h-4 inline mr-2" />
            Token Symbol
          </label>
          <input
            type="text"
            value={formData.tokenSymbol}
            onChange={(e) => handleInputChange('tokenSymbol', e.target.value.toUpperCase())}
            placeholder="e.g., MAT"
            maxLength={6}
            className={`w-full px-4 py-3 bg-dark-card border rounded-lg text-dark-text placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.tokenSymbol ? 'border-red-500' : 'border-gray-600'
            }`}
          />
          {errors.tokenSymbol && (
            <p className="text-red-400 text-sm mt-1">{errors.tokenSymbol}</p>
          )}
        </div>

        {/* Decimals */}
        <div>
          <label className="block text-sm font-medium text-dark-text mb-2">
            Decimals
          </label>
          <select
            value={formData.decimals}
            onChange={(e) => handleInputChange('decimals', parseInt(e.target.value))}
            className="w-full px-4 py-3 bg-dark-card border border-gray-600 rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={6}>6 decimals</option>
            <option value={8}>8 decimals</option>
            <option value={18}>18 decimals (recommended)</option>
          </select>
        </div>

        {/* Total Supply */}
        <div>
          <label className="block text-sm font-medium text-dark-text mb-2">
            <DollarSign className="w-4 h-4 inline mr-2" />
            Total Supply
          </label>
          <input
            type="number"
            value={formData.totalSupply}
            onChange={(e) => handleInputChange('totalSupply', e.target.value)}
            placeholder="e.g., 1000000"
            min="1"
            className={`w-full px-4 py-3 bg-dark-card border rounded-lg text-dark-text placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.totalSupply ? 'border-red-500' : 'border-gray-600'
            }`}
          />
          {errors.totalSupply && (
            <p className="text-red-400 text-sm mt-1">{errors.totalSupply}</p>
          )}
        </div>
      </div>

      {/* Blockchain Network */}
      <div>
        <label className="block text-sm font-medium text-dark-text mb-2">
          <Globe className="w-4 h-4 inline mr-2" />
          Blockchain Network
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {networks.map((network) => (
            <label
              key={network.value}
              className={`flex items-center p-4 rounded-lg border cursor-pointer transition-colors ${
                formData.blockchainNetwork === network.value
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              <input
                type="radio"
                name="network"
                value={network.value}
                checked={formData.blockchainNetwork === network.value}
                onChange={(e) => handleInputChange('blockchainNetwork', e.target.value)}
                className="sr-only"
              />
              <span className="text-2xl mr-3">{network.icon}</span>
              <span className="text-dark-text font-medium">{network.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200"
        >
          Continue to Deployment
        </button>
      </div>
    </form>
  );
};

export default TokenConfigForm;
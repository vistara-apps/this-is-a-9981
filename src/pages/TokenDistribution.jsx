import React, { useState } from 'react';
import { useToken } from '../contexts/TokenContext';
import InvestorTable from '../components/InvestorTable';
import VestingScheduleBuilder from '../components/VestingScheduleBuilder';
import { Send, Users, Clock, TrendingUp } from 'lucide-react';

const TokenDistribution = () => {
  const { tokens, investors, campaigns } = useToken();
  const [selectedToken, setSelectedToken] = useState('');
  const [activeTab, setActiveTab] = useState('investors');

  const selectedTokenData = tokens.find(t => t.tokenId === selectedToken);
  const tokenInvestors = investors.filter(i => i.tokenId === selectedToken);
  const tokenCampaign = campaigns.find(c => c.tokenId === selectedToken);

  const totalDistributed = tokenInvestors.reduce((sum, investor) => sum + parseFloat(investor.tokensHeld), 0);
  const totalInvested = tokenInvestors.reduce((sum, investor) => sum + parseFloat(investor.amountInvested), 0);

  const distributionStats = [
    {
      title: 'Total Investors',
      value: tokenInvestors.length.toString(),
      icon: Users,
      color: 'text-blue-400'
    },
    {
      title: 'Tokens Distributed',
      value: totalDistributed.toLocaleString(),
      icon: Send,
      color: 'text-green-400'
    },
    {
      title: 'Total Invested',
      value: `$${totalInvested.toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-purple-400'
    },
    {
      title: 'Pending Vesting',
      value: '15,000',
      icon: Clock,
      color: 'text-orange-400'
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="card-gradient rounded-lg p-6">
        <h2 className="text-2xl font-bold text-dark-text mb-2">Token Distribution</h2>
        <p className="text-dark-muted">
          Manage token distribution to investors and configure vesting schedules.
        </p>
      </div>

      {/* Token Selection */}
      <div className="card-gradient rounded-lg p-6">
        <label className="block text-sm font-medium text-dark-text mb-2">
          Select Token
        </label>
        <select
          value={selectedToken}
          onChange={(e) => setSelectedToken(e.target.value)}
          className="w-full max-w-md px-4 py-3 bg-dark-card border border-gray-600 rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Choose a token...</option>
          {tokens.map((token) => (
            <option key={token.tokenId} value={token.tokenId}>
              {token.tokenName} ({token.tokenSymbol})
            </option>
          ))}
        </select>
      </div>

      {selectedToken && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {distributionStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="card-gradient rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-dark-muted text-sm">{stat.title}</p>
                      <p className="text-2xl font-bold text-dark-text mt-1">{stat.value}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tabs */}
          <div className="card-gradient rounded-lg p-6">
            <div className="border-b border-gray-700 mb-6">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('investors')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'investors'
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-dark-muted hover:text-dark-text hover:border-gray-600'
                  }`}
                >
                  Investor Management
                </button>
                <button
                  onClick={() => setActiveTab('vesting')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'vesting'
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-dark-muted hover:text-dark-text hover:border-gray-600'
                  }`}
                >
                  Vesting Schedules
                </button>
              </nav>
            </div>

            {activeTab === 'investors' && (
              <InvestorTable 
                investors={tokenInvestors} 
                tokenData={selectedTokenData}
              />
            )}

            {activeTab === 'vesting' && (
              <VestingScheduleBuilder 
                tokenId={selectedToken}
                investors={tokenInvestors}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TokenDistribution;
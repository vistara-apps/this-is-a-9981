import React from 'react';
import { useToken } from '../contexts/TokenContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Coins, DollarSign } from 'lucide-react';

const Dashboard = () => {
  const { tokens, campaigns, investors } = useToken();

  // Mock data for charts
  const monthlyData = [
    { month: 'Jan', tokens: 65, campaigns: 28, investors: 180 },
    { month: 'Feb', tokens: 59, campaigns: 48, investors: 200 },
    { month: 'Mar', tokens: 80, campaigns: 40, investors: 250 },
    { month: 'Apr', tokens: 81, campaigns: 19, investors: 300 },
    { month: 'May', tokens: 56, campaigns: 36, investors: 280 },
    { month: 'Jun', tokens: 95, campaigns: 27, investors: 350 },
  ];

  const distributionData = [
    { name: 'Public Sale', value: 45, color: '#6366F1' },
    { name: 'Team', value: 20, color: '#8B5CF6' },
    { name: 'Advisors', value: 15, color: '#EC4899' },
    { name: 'Reserve', value: 20, color: '#06B6D4' },
  ];

  const totalRaised = campaigns.reduce((sum, campaign) => sum + parseFloat(campaign.raised || 0), 0);
  const totalTokens = tokens.length;
  const totalInvestors = investors.length;
  const activeCampaigns = campaigns.filter(c => c.currentState === 'active').length;

  const metrics = [
    {
      title: 'Total Raised',
      value: `$${totalRaised.toLocaleString()}`,
      icon: DollarSign,
      change: '+12.5%',
      color: 'text-green-400'
    },
    {
      title: 'Active Tokens',
      value: totalTokens.toString(),
      icon: Coins,
      change: '+5.2%',
      color: 'text-blue-400'
    },
    {
      title: 'Total Investors',
      value: totalInvestors.toString(),
      icon: Users,
      change: '+18.1%',
      color: 'text-purple-400'
    },
    {
      title: 'Active Campaigns',
      value: activeCampaigns.toString(),
      icon: TrendingUp,
      change: '+8.3%',
      color: 'text-orange-400'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="card-gradient rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-dark-muted text-sm">{metric.title}</p>
                  <p className="text-2xl font-bold text-dark-text mt-1">{metric.value}</p>
                  <p className={`text-sm mt-1 ${metric.color}`}>{metric.change}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Performance Chart */}
        <div className="card-gradient rounded-lg p-6">
          <h3 className="text-lg font-semibold text-dark-text mb-4">Monthly Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Bar dataKey="tokens" fill="#6366F1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="campaigns" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Token Distribution Chart */}
        <div className="card-gradient rounded-lg p-6">
          <h3 className="text-lg font-semibold text-dark-text mb-4">Token Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={distributionData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
              >
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-4 mt-4">
            {distributionData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-dark-muted">{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card-gradient rounded-lg p-6">
        <h3 className="text-lg font-semibold text-dark-text mb-4">Recent Tokens</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-dark-muted">Token</th>
                <th className="text-left py-3 px-4 font-medium text-dark-muted">Symbol</th>
                <th className="text-left py-3 px-4 font-medium text-dark-muted">Network</th>
                <th className="text-left py-3 px-4 font-medium text-dark-muted">Supply</th>
                <th className="text-left py-3 px-4 font-medium text-dark-muted">Created</th>
              </tr>
            </thead>
            <tbody>
              {tokens.map((token) => (
                <tr key={token.tokenId} className="border-b border-gray-800 hover:bg-dark-card/30">
                  <td className="py-3 px-4 text-dark-text font-medium">{token.tokenName}</td>
                  <td className="py-3 px-4 text-dark-muted">{token.tokenSymbol}</td>
                  <td className="py-3 px-4 text-dark-muted">{token.blockchainNetwork}</td>
                  <td className="py-3 px-4 text-dark-muted">{parseFloat(token.totalSupply).toLocaleString()}</td>
                  <td className="py-3 px-4 text-dark-muted">
                    {new Date(token.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
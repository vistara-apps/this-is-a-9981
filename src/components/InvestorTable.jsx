import React, { useState } from 'react';
import { useToken } from '../contexts/TokenContext';
import { Search, Send, MoreHorizontal, ExternalLink } from 'lucide-react';

const InvestorTable = ({ investors, tokenData }) => {
  const { addInvestor } = useToken();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newInvestor, setNewInvestor] = useState({
    walletAddress: '',
    amountInvested: '',
    tokensHeld: ''
  });

  const filteredInvestors = investors.filter(investor =>
    investor.walletAddress.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddInvestor = (e) => {
    e.preventDefault();
    addInvestor({
      ...newInvestor,
      tokenId: tokenData.tokenId
    });
    setNewInvestor({ walletAddress: '', amountInvested: '', tokensHeld: '' });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-muted w-4 h-4" />
          <input
            type="text"
            placeholder="Search by wallet address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-dark-card border border-gray-600 rounded-lg text-dark-text placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-200"
        >
          Add Investor
        </button>
      </div>

      {/* Investors Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-4 font-medium text-dark-muted">Wallet Address</th>
              <th className="text-left py-3 px-4 font-medium text-dark-muted">Amount Invested</th>
              <th className="text-left py-3 px-4 font-medium text-dark-muted">Tokens Held</th>
              <th className="text-left py-3 px-4 font-medium text-dark-muted">Vesting Status</th>
              <th className="text-left py-3 px-4 font-medium text-dark-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvestors.map((investor) => (
              <tr key={investor.investorId} className="border-b border-gray-800 hover:bg-dark-card/30">
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-dark-text font-mono text-sm">
                      {investor.walletAddress.slice(0, 6)}...{investor.walletAddress.slice(-4)}
                    </span>
                    <button className="text-dark-muted hover:text-dark-text">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </td>
                <td className="py-3 px-4 text-dark-text">${parseFloat(investor.amountInvested).toLocaleString()}</td>
                <td className="py-3 px-4 text-dark-text">{parseFloat(investor.tokensHeld).toLocaleString()}</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                    Active
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    <button className="p-1 text-dark-muted hover:text-blue-400">
                      <Send className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-dark-muted hover:text-dark-text">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Investor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-dark-surface rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-dark-text mb-4">Add New Investor</h3>
            <form onSubmit={handleAddInvestor} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">
                  Wallet Address
                </label>
                <input
                  type="text"
                  value={newInvestor.walletAddress}
                  onChange={(e) => setNewInvestor(prev => ({ ...prev, walletAddress: e.target.value }))}
                  placeholder="0x..."
                  className="w-full px-3 py-2 bg-dark-card border border-gray-600 rounded-lg text-dark-text placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">
                  Amount Invested (USD)
                </label>
                <input
                  type="number"
                  value={newInvestor.amountInvested}
                  onChange={(e) => setNewInvestor(prev => ({ ...prev, amountInvested: e.target.value }))}
                  placeholder="1000"
                  className="w-full px-3 py-2 bg-dark-card border border-gray-600 rounded-lg text-dark-text placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">
                  Tokens to Allocate
                </label>
                <input
                  type="number"
                  value={newInvestor.tokensHeld}
                  onChange={(e) => setNewInvestor(prev => ({ ...prev, tokensHeld: e.target.value }))}
                  placeholder="10000"
                  className="w-full px-3 py-2 bg-dark-card border border-gray-600 rounded-lg text-dark-text placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-dark-muted hover:text-dark-text border border-gray-600 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg"
                >
                  Add Investor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestorTable;
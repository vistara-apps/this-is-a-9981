import React, { useState } from 'react';
import { Calendar, Percent, Clock, Plus } from 'lucide-react';

const VestingScheduleBuilder = ({ tokenId, investors }) => {
  const [vestingSchedules, setVestingSchedules] = useState([
    {
      id: '1',
      name: 'Team Vesting',
      startTime: '2024-03-01',
      period: '24',
      initialRelease: '10',
      releaseAmount: '3.75',
      description: 'Standard team vesting schedule'
    }
  ]);

  const [newSchedule, setNewSchedule] = useState({
    name: '',
    startTime: '',
    period: '',
    initialRelease: '',
    releaseAmount: '',
    description: ''
  });

  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddSchedule = (e) => {
    e.preventDefault();
    const schedule = {
      ...newSchedule,
      id: Date.now().toString(),
    };
    setVestingSchedules(prev => [...prev, schedule]);
    setNewSchedule({
      name: '',
      startTime: '',
      period: '',
      initialRelease: '',
      releaseAmount: '',
      description: ''
    });
    setShowAddModal(false);
  };

  const presetSchedules = [
    {
      name: 'Team (2 years)',
      period: '24',
      initialRelease: '10',
      releaseAmount: '3.75',
      description: '10% initial, then 3.75% monthly for 24 months'
    },
    {
      name: 'Advisors (1 year)',
      period: '12',
      initialRelease: '20',
      releaseAmount: '6.67',
      description: '20% initial, then 6.67% monthly for 12 months'
    },
    {
      name: 'Strategic (6 months)',
      period: '6',
      initialRelease: '25',
      releaseAmount: '12.5',
      description: '25% initial, then 12.5% monthly for 6 months'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-dark-text">Vesting Schedules</h3>
          <p className="text-dark-muted text-sm">Configure token vesting schedules for different investor types.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-200"
        >
          <Plus className="w-4 h-4 inline mr-2" />
          Create Schedule
        </button>
      </div>

      {/* Preset Templates */}
      <div>
        <h4 className="text-dark-text font-medium mb-3">Quick Templates</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {presetSchedules.map((preset, index) => (
            <div key={index} className="bg-dark-card rounded-lg p-4 border border-gray-700 hover:border-blue-500 cursor-pointer transition-colors">
              <h5 className="text-dark-text font-medium mb-2">{preset.name}</h5>
              <p className="text-dark-muted text-sm mb-3">{preset.description}</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-dark-muted">Period:</span>
                  <span className="text-dark-text ml-1">{preset.period}mo</span>
                </div>
                <div>
                  <span className="text-dark-muted">Initial:</span>
                  <span className="text-dark-text ml-1">{preset.initialRelease}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Existing Schedules */}
      <div>
        <h4 className="text-dark-text font-medium mb-3">Active Schedules</h4>
        <div className="space-y-4">
          {vestingSchedules.map((schedule) => {
            const totalMonths = parseInt(schedule.period);
            const monthlyRelease = parseFloat(schedule.releaseAmount);
            const initialRelease = parseFloat(schedule.initialRelease);
            const progressMonth = 6; // Mock current month
            const releasedPercentage = initialRelease + (progressMonth * monthlyRelease);

            return (
              <div key={schedule.id} className="bg-dark-card rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h5 className="text-dark-text font-medium text-lg">{schedule.name}</h5>
                    <p className="text-dark-muted text-sm">{schedule.description}</p>
                  </div>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                    Active
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-dark-muted text-xs mb-1">Start Date</p>
                    <p className="text-dark-text font-medium">{new Date(schedule.startTime).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-dark-muted text-xs mb-1">Period</p>
                    <p className="text-dark-text font-medium">{schedule.period} months</p>
                  </div>
                  <div>
                    <p className="text-dark-muted text-xs mb-1">Initial Release</p>
                    <p className="text-dark-text font-medium">{schedule.initialRelease}%</p>
                  </div>
                  <div>
                    <p className="text-dark-muted text-xs mb-1">Monthly Release</p>
                    <p className="text-dark-text font-medium">{schedule.releaseAmount}%</p>
                  </div>
                </div>

                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-dark-muted">Progress</span>
                    <span className="text-dark-text">{releasedPercentage.toFixed(1)}% released</span>
                  </div>
                  <div className="w-full bg-dark-bg rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(releasedPercentage, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-dark-muted text-xs mt-1">
                    Month {progressMonth} of {totalMonths}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Schedule Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-dark-surface rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-dark-text mb-4">Create Vesting Schedule</h3>
            <form onSubmit={handleAddSchedule} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">
                    Schedule Name
                  </label>
                  <input
                    type="text"
                    value={newSchedule.name}
                    onChange={(e) => setNewSchedule(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Team Vesting"
                    className="w-full px-3 py-2 bg-dark-card border border-gray-600 rounded-lg text-dark-text placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={newSchedule.startTime}
                    onChange={(e) => setNewSchedule(prev => ({ ...prev, startTime: e.target.value }))}
                    className="w-full px-3 py-2 bg-dark-card border border-gray-600 rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Vesting Period (months)
                  </label>
                  <input
                    type="number"
                    value={newSchedule.period}
                    onChange={(e) => setNewSchedule(prev => ({ ...prev, period: e.target.value }))}
                    placeholder="24"
                    min="1"
                    className="w-full px-3 py-2 bg-dark-card border border-gray-600 rounded-lg text-dark-text placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">
                    <Percent className="w-4 h-4 inline mr-1" />
                    Initial Release (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newSchedule.initialRelease}
                    onChange={(e) => setNewSchedule(prev => ({ ...prev, initialRelease: e.target.value }))}
                    placeholder="10"
                    min="0"
                    max="100"
                    className="w-full px-3 py-2 bg-dark-card border border-gray-600 rounded-lg text-dark-text placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">
                    Monthly Release (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newSchedule.releaseAmount}
                    onChange={(e) => setNewSchedule(prev => ({ ...prev, releaseAmount: e.target.value }))}
                    placeholder="3.75"
                    min="0"
                    max="100"
                    className="w-full px-3 py-2 bg-dark-card border border-gray-600 rounded-lg text-dark-text placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">
                  Description
                </label>
                <textarea
                  value={newSchedule.description}
                  onChange={(e) => setNewSchedule(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe this vesting schedule..."
                  rows={3}
                  className="w-full px-3 py-2 bg-dark-card border border-gray-600 rounded-lg text-dark-text placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  Create Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VestingScheduleBuilder;
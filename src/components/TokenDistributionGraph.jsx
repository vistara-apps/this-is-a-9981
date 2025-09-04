import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const TokenDistributionGraph = ({ 
  data = [], 
  variant = 'default', 
  title = 'Token Distribution',
  height = 300,
  showLegend = true,
  showTooltip = true 
}) => {
  // Default color palette
  const COLORS = [
    '#6366F1', // Indigo
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#06B6D4', // Cyan
    '#10B981', // Emerald
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#84CC16', // Lime
  ];

  // Custom tooltip for pie chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-dark-card border border-dark-border rounded-lg p-3 shadow-lg">
          <p className="text-dark-text font-medium">{data.name}</p>
          <p className="text-dark-accent">
            Value: <span className="font-semibold">{data.value}%</span>
          </p>
          {data.payload.amount && (
            <p className="text-dark-muted text-sm">
              Amount: {data.payload.amount.toLocaleString()} tokens
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Custom label for pie chart
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null; // Don't show labels for slices smaller than 5%
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-sm font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Render pie chart variant
  const renderPieChart = () => (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={variant === 'withLabels' ? renderCustomLabel : false}
          outerRadius={variant === 'donut' ? 100 : 120}
          innerRadius={variant === 'donut' ? 60 : 0}
          fill="#8884d8"
          dataKey="value"
          animationBegin={0}
          animationDuration={800}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.color || COLORS[index % COLORS.length]} 
            />
          ))}
        </Pie>
        {showTooltip && <Tooltip content={<CustomTooltip />} />}
        {showLegend && (
          <Legend 
            verticalAlign="bottom" 
            height={36}
            wrapperStyle={{ color: '#E5E7EB' }}
          />
        )}
      </PieChart>
    </ResponsiveContainer>
  );

  // Render bar chart variant
  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis 
          dataKey="name" 
          stroke="#9CA3AF"
          fontSize={12}
        />
        <YAxis 
          stroke="#9CA3AF"
          fontSize={12}
        />
        {showTooltip && <Tooltip content={<CustomTooltip />} />}
        <Bar 
          dataKey="value" 
          fill="#6366F1"
          radius={[4, 4, 0, 0]}
          animationDuration={800}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.color || COLORS[index % COLORS.length]} 
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );

  // Render horizontal bar chart variant
  const renderHorizontalBarChart = () => (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart 
        data={data} 
        layout="horizontal"
        margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis 
          type="number" 
          stroke="#9CA3AF"
          fontSize={12}
        />
        <YAxis 
          type="category" 
          dataKey="name" 
          stroke="#9CA3AF"
          fontSize={12}
          width={80}
        />
        {showTooltip && <Tooltip content={<CustomTooltip />} />}
        <Bar 
          dataKey="value" 
          fill="#6366F1"
          radius={[0, 4, 4, 0]}
          animationDuration={800}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.color || COLORS[index % COLORS.length]} 
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );

  // Render chart based on variant
  const renderChart = () => {
    switch (variant) {
      case 'bar':
        return renderBarChart();
      case 'horizontalBar':
        return renderHorizontalBarChart();
      case 'donut':
      case 'withLabels':
      case 'default':
      default:
        return renderPieChart();
    }
  };

  // Calculate total for summary
  const total = data.reduce((sum, item) => sum + (item.value || 0), 0);

  return (
    <div className="bg-dark-card rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-dark-text">{title}</h3>
        {variant === 'donut' && (
          <div className="text-center">
            <div className="text-2xl font-bold text-dark-text">{total}%</div>
            <div className="text-sm text-dark-muted">Total</div>
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="w-full">
        {data.length > 0 ? (
          renderChart()
        ) : (
          <div className="flex items-center justify-center h-64 text-dark-muted">
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <p>No distribution data available</p>
            </div>
          </div>
        )}
      </div>

      {/* Summary Table for detailed view */}
      {variant === 'detailed' && data.length > 0 && (
        <div className="mt-6 border-t border-dark-border pt-4">
          <h4 className="text-sm font-medium text-dark-text mb-3">Distribution Details</h4>
          <div className="space-y-2">
            {data.map((item, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color || COLORS[index % COLORS.length] }}
                  />
                  <span className="text-dark-text text-sm">{item.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-dark-text font-medium">{item.value}%</div>
                  {item.amount && (
                    <div className="text-dark-muted text-xs">
                      {item.amount.toLocaleString()} tokens
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TokenDistributionGraph;

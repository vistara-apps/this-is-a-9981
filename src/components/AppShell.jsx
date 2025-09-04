import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { 
  LayoutDashboard, 
  Coins, 
  TrendingUp, 
  Users, 
  Settings,
  Home
} from 'lucide-react';

const AppShell = ({ children }) => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Create Token', href: '/create-token', icon: Coins },
    { name: 'ICO Campaign', href: '/ico-campaign', icon: TrendingUp },
    { name: 'Distribution', href: '/distribution', icon: Users },
  ];

  const isActive = (href) => location.pathname === href;

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-dark-surface border-r border-gray-700">
        <div className="p-6">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-dark-text">ICO Factory</span>
          </Link>
        </div>

        <nav className="px-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-dark-primary text-white'
                    : 'text-dark-muted hover:text-dark-text hover:bg-dark-card'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-dark-surface border-b border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-dark-text">
              {navigation.find(item => isActive(item.href))?.name || 'Dashboard'}
            </h1>
            <ConnectButton />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppShell;
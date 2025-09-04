import React from 'react';
import { Link } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ArrowRight, Zap, Shield, TrendingUp, Users } from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: Zap,
      title: 'Automated Token Generation',
      description: 'One-click generation of compliant ERC-20 tokens with customizable parameters.'
    },
    {
      icon: Shield,
      title: 'Smart Contract Deployment',
      description: 'Instant deployment of pre-audited smart contracts to multiple blockchain networks.'
    },
    {
      icon: TrendingUp,
      title: 'Investor Dashboard & Analytics',
      description: 'Comprehensive analytics for token distribution, holders, and transaction history.'
    },
    {
      icon: Users,
      title: 'Distribution & Vesting Tools',
      description: 'Automated token distribution and vesting schedule management.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-dark-surface/80 backdrop-blur-md border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-dark-text">ICO Factory</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                to="/dashboard" 
                className="text-dark-muted hover:text-dark-text transition-colors"
              >
                Dashboard
              </Link>
              <ConnectButton />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-dark-text mb-6">
            Launch your{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              ERC-20 token
            </span>{' '}
            and ICO in minutes
          </h1>
          <p className="text-xl text-dark-muted mb-8 max-w-2xl mx-auto">
            An AI-powered platform for solo founders to easily generate, deploy, and manage ICO tokens and smart contracts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <button className="inline-flex items-center justify-center px-8 py-4 border border-gray-600 text-dark-text font-semibold rounded-lg hover:bg-dark-card transition-all duration-200">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-dark-text mb-4">
              Everything you need to launch your ICO
            </h2>
            <p className="text-dark-muted max-w-2xl mx-auto">
              From token creation to investor management, we've got you covered with enterprise-grade tools.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="card-gradient rounded-lg p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-dark-text mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-dark-muted text-sm">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="card-gradient rounded-2xl p-12">
            <h2 className="text-3xl font-bold text-dark-text mb-4">
              Ready to launch your ICO?
            </h2>
            <p className="text-dark-muted mb-8">
              Join thousands of founders who trust ICO Factory to bring their vision to life.
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200"
            >
              Start Building Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppShell from './components/AppShell';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import TokenCreation from './pages/TokenCreation';
import ICOCampaign from './pages/ICOCampaign';
import TokenDistribution from './pages/TokenDistribution';
import { TokenProvider } from './contexts/TokenContext';

function App() {
  return (
    <TokenProvider>
      <Router>
        <div className="min-h-screen gradient-bg">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<AppShell><Dashboard /></AppShell>} />
            <Route path="/create-token" element={<AppShell><TokenCreation /></AppShell>} />
            <Route path="/ico-campaign" element={<AppShell><ICOCampaign /></AppShell>} />
            <Route path="/distribution" element={<AppShell><TokenDistribution /></AppShell>} />
          </Routes>
        </div>
      </Router>
    </TokenProvider>
  );
}

export default App;
import React, { createContext, useContext, useState } from 'react';

const TokenContext = createContext();

export const useToken = () => {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error('useToken must be used within a TokenProvider');
  }
  return context;
};

export const TokenProvider = ({ children }) => {
  const [tokens, setTokens] = useState([
    {
      tokenId: '1',
      tokenName: 'DemoToken',
      tokenSymbol: 'DEMO',
      decimals: 18,
      totalSupply: '1000000',
      contractAddress: '0x1234...5678',
      blockchainNetwork: 'Ethereum',
      createdAt: new Date().toISOString(),
    }
  ]);

  const [campaigns, setCampaigns] = useState([
    {
      campaignId: '1',
      tokenId: '1',
      startDate: '2024-01-01',
      endDate: '2024-03-01',
      fundraisingGoal: '500000',
      tokenPrice: '0.10',
      cap: '1000000',
      currentState: 'active',
      raised: '125000'
    }
  ]);

  const [investors, setInvestors] = useState([
    {
      investorId: '1',
      walletAddress: '0xabcd...efgh',
      tokenId: '1',
      amountInvested: '1000',
      tokensHeld: '10000',
      vestingScheduleId: '1'
    },
    {
      investorId: '2',
      walletAddress: '0x1234...5678',
      tokenId: '1',
      amountInvested: '500',
      tokensHeld: '5000',
      vestingScheduleId: '2'
    }
  ]);

  const addToken = (token) => {
    const newToken = {
      ...token,
      tokenId: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setTokens(prev => [...prev, newToken]);
    return newToken;
  };

  const addCampaign = (campaign) => {
    const newCampaign = {
      ...campaign,
      campaignId: Date.now().toString(),
      currentState: 'active',
      raised: '0'
    };
    setCampaigns(prev => [...prev, newCampaign]);
    return newCampaign;
  };

  const addInvestor = (investor) => {
    const newInvestor = {
      ...investor,
      investorId: Date.now().toString(),
    };
    setInvestors(prev => [...prev, newInvestor]);
    return newInvestor;
  };

  return (
    <TokenContext.Provider
      value={{
        tokens,
        campaigns,
        investors,
        addToken,
        addCampaign,
        addInvestor,
      }}
    >
      {children}
    </TokenContext.Provider>
  );
};
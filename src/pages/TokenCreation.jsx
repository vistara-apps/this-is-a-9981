import React, { useState } from 'react';
import { useToken } from '../contexts/TokenContext';
import { useNavigate } from 'react-router-dom';
import TokenConfigForm from '../components/TokenConfigForm';
import SmartContractDeployer from '../components/SmartContractDeployer';
import { CheckCircle, AlertCircle } from 'lucide-react';

const TokenCreation = () => {
  const { addToken } = useToken();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [tokenConfig, setTokenConfig] = useState(null);
  const [deploymentStatus, setDeploymentStatus] = useState('idle');

  const handleTokenConfigComplete = (config) => {
    setTokenConfig(config);
    setStep(2);
  };

  const handleDeployment = async () => {
    setDeploymentStatus('deploying');
    
    // Simulate deployment process
    setTimeout(() => {
      const newToken = addToken({
        ...tokenConfig,
        contractAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
      });
      setDeploymentStatus('success');
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    }, 3000);
  };

  const steps = [
    { number: 1, title: 'Configure Token', completed: step > 1 },
    { number: 2, title: 'Deploy Contract', completed: deploymentStatus === 'success' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((stepItem, index) => (
            <React.Fragment key={stepItem.number}>
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    stepItem.completed
                      ? 'bg-green-500 text-white'
                      : step === stepItem.number
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-600 text-gray-300'
                  }`}
                >
                  {stepItem.completed ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    stepItem.number
                  )}
                </div>
                <span
                  className={`ml-3 font-medium ${
                    stepItem.completed || step === stepItem.number
                      ? 'text-dark-text'
                      : 'text-dark-muted'
                  }`}
                >
                  {stepItem.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-4 ${
                    stepItem.completed ? 'bg-green-500' : 'bg-gray-600'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="card-gradient rounded-lg p-8">
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold text-dark-text mb-6">Configure Your Token</h2>
            <p className="text-dark-muted mb-8">
              Set up the basic parameters for your ERC-20 token. All fields are required for deployment.
            </p>
            <TokenConfigForm onComplete={handleTokenConfigComplete} />
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold text-dark-text mb-6">Deploy Smart Contract</h2>
            <p className="text-dark-muted mb-8">
              Review your token configuration and deploy to the blockchain.
            </p>
            <SmartContractDeployer
              tokenConfig={tokenConfig}
              onDeploy={handleDeployment}
              deploymentStatus={deploymentStatus}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenCreation;
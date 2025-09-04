import React from 'react';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

const SmartContractDeployer = ({ tokenConfig, onDeploy, deploymentStatus }) => {
  const getStatusIcon = () => {
    switch (deploymentStatus) {
      case 'deploying':
        return <Clock className="w-6 h-6 text-yellow-400 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-400" />;
      case 'error':
        return <AlertCircle className="w-6 h-6 text-red-400" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (deploymentStatus) {
      case 'deploying':
        return 'Deploying contract...';
      case 'success':
        return 'Contract deployed successfully!';
      case 'error':
        return 'Deployment failed. Please try again.';
      default:
        return 'Ready to deploy';
    }
  };

  const estimatedGasFee = '0.025 ETH';
  const estimatedTime = '2-3 minutes';

  return (
    <div className="space-y-6">
      {/* Token Configuration Review */}
      <div className="bg-dark-card rounded-lg p-6">
        <h3 className="text-lg font-semibold text-dark-text mb-4">Token Configuration</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-dark-muted">Name:</span>
            <span className="text-dark-text ml-2 font-medium">{tokenConfig?.tokenName}</span>
          </div>
          <div>
            <span className="text-dark-muted">Symbol:</span>
            <span className="text-dark-text ml-2 font-medium">{tokenConfig?.tokenSymbol}</span>
          </div>
          <div>
            <span className="text-dark-muted">Decimals:</span>
            <span className="text-dark-text ml-2 font-medium">{tokenConfig?.decimals}</span>
          </div>
          <div>
            <span className="text-dark-muted">Total Supply:</span>
            <span className="text-dark-text ml-2 font-medium">
              {parseFloat(tokenConfig?.totalSupply || 0).toLocaleString()}
            </span>
          </div>
          <div className="col-span-2">
            <span className="text-dark-muted">Network:</span>
            <span className="text-dark-text ml-2 font-medium capitalize">
              {tokenConfig?.blockchainNetwork}
            </span>
          </div>
        </div>
      </div>

      {/* Deployment Estimates */}
      <div className="bg-dark-card rounded-lg p-6">
        <h3 className="text-lg font-semibold text-dark-text mb-4">Deployment Estimates</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-dark-muted">Estimated Gas Fee:</span>
            <span className="text-dark-text ml-2 font-medium">{estimatedGasFee}</span>
          </div>
          <div>
            <span className="text-dark-muted">Estimated Time:</span>
            <span className="text-dark-text ml-2 font-medium">{estimatedTime}</span>
          </div>
        </div>
      </div>

      {/* Deployment Status */}
      {deploymentStatus !== 'idle' && (
        <div className="bg-dark-card rounded-lg p-6">
          <div className="flex items-center space-x-3">
            {getStatusIcon()}
            <span className="text-dark-text font-medium">{getStatusText()}</span>
          </div>
          
          {deploymentStatus === 'deploying' && (
            <div className="mt-4">
              <div className="bg-dark-bg rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full animate-pulse w-3/4"></div>
              </div>
              <p className="text-dark-muted text-sm mt-2">
                Please don't close this page. Deployment is in progress...
              </p>
            </div>
          )}

          {deploymentStatus === 'success' && (
            <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-green-400 font-medium">Contract Address:</p>
              <p className="text-dark-text text-sm font-mono mt-1">
                0x1234567890abcdef1234567890abcdef12345678
              </p>
              <p className="text-dark-muted text-sm mt-2">
                Your token has been successfully deployed! You can now create an ICO campaign.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Deploy Button */}
      {deploymentStatus === 'idle' && (
        <div className="flex justify-end">
          <button
            onClick={onDeploy}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200"
          >
            Deploy Smart Contract
          </button>
        </div>
      )}
    </div>
  );
};

export default SmartContractDeployer;
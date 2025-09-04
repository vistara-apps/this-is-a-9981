import axios from 'axios';
import { API_CONFIG, handleApiError, retryRequest } from './index';

/**
 * Turnkey Service for wallet management and secure key operations
 * Provides methods for wallet creation, transaction signing, and key management
 */
class TurnkeyService {
  constructor() {
    this.apiKey = API_CONFIG.apiKeys.turnkey;
    this.baseURL = API_CONFIG.endpoints.turnkey;
    
    // Create axios instance with default configuration
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: API_CONFIG.timeout,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
    });
    
    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        throw handleApiError(error);
      }
    );
  }

  /**
   * Create a new wallet
   * @param {Object} walletData - Wallet creation data
   * @returns {Promise<Object>} Created wallet information
   */
  async createWallet(walletData) {
    return retryRequest(async () => {
      const response = await this.client.post('/wallets/create', {
        walletName: walletData.name || `ICO-Wallet-${Date.now()}`,
        accounts: [{
          curve: 'CURVE_SECP256K1',
          pathFormat: 'PATH_FORMAT_BIP32',
          path: "m/44'/60'/0'/0/0", // Ethereum derivation path
          addressFormat: 'ADDRESS_FORMAT_ETHEREUM',
        }],
        ...walletData,
      });
      
      return {
        walletId: response.data.walletId,
        address: response.data.accounts[0].address,
        publicKey: response.data.accounts[0].publicKey,
        created: true,
      };
    });
  }

  /**
   * Get wallet information
   * @param {string} walletId - Wallet ID
   * @returns {Promise<Object>} Wallet information
   */
  async getWallet(walletId) {
    return retryRequest(async () => {
      const response = await this.client.get(`/wallets/${walletId}`);
      return response.data;
    });
  }

  /**
   * List all wallets for the organization
   * @param {Object} options - Listing options
   * @returns {Promise<Array>} Array of wallets
   */
  async listWallets(options = {}) {
    return retryRequest(async () => {
      const params = new URLSearchParams();
      
      if (options.limit) {
        params.append('limit', options.limit);
      }
      
      if (options.cursor) {
        params.append('cursor', options.cursor);
      }
      
      const response = await this.client.get(`/wallets?${params.toString()}`);
      return response.data.wallets || [];
    });
  }

  /**
   * Sign a transaction
   * @param {Object} signData - Transaction signing data
   * @returns {Promise<Object>} Signed transaction
   */
  async signTransaction(signData) {
    return retryRequest(async () => {
      const { walletId, unsignedTransaction, type = 'TRANSACTION_TYPE_ETHEREUM' } = signData;
      
      const response = await this.client.post('/sign', {
        walletId,
        type,
        unsignedTransaction,
      });
      
      return {
        signedTransaction: response.data.signedTransaction,
        transactionHash: response.data.transactionHash,
        signature: response.data.signature,
      };
    });
  }

  /**
   * Sign a message
   * @param {Object} signData - Message signing data
   * @returns {Promise<Object>} Signed message
   */
  async signMessage(signData) {
    return retryRequest(async () => {
      const { walletId, message, encoding = 'ENCODING_UTF8' } = signData;
      
      const response = await this.client.post('/sign', {
        walletId,
        type: 'TRANSACTION_TYPE_ETHEREUM_PERSONAL_SIGN',
        message,
        encoding,
      });
      
      return {
        signature: response.data.signature,
        message: response.data.message,
      };
    });
  }

  /**
   * Create a smart contract deployment transaction
   * @param {Object} deploymentData - Contract deployment data
   * @returns {Promise<Object>} Deployment transaction data
   */
  async createDeploymentTransaction(deploymentData) {
    const {
      walletId,
      bytecode,
      constructorParams = [],
      gasLimit,
      gasPrice,
      nonce,
      chainId = 1, // Ethereum mainnet
    } = deploymentData;

    try {
      // Prepare transaction data
      const transactionData = {
        to: null, // Contract deployment
        value: '0x0',
        data: bytecode + this.encodeConstructorParams(constructorParams),
        gasLimit: gasLimit || '0x5B8D80', // 6,000,000 gas
        gasPrice: gasPrice || '0x9502F9000', // 40 Gwei
        nonce: nonce || '0x0',
        chainId,
      };

      // Sign the transaction
      const signedTx = await this.signTransaction({
        walletId,
        unsignedTransaction: transactionData,
      });

      return {
        ...signedTx,
        transactionData,
        deploymentType: 'CONTRACT_DEPLOYMENT',
      };
    } catch (error) {
      throw new Error(`Contract deployment transaction creation failed: ${error.message}`);
    }
  }

  /**
   * Create a token transfer transaction
   * @param {Object} transferData - Token transfer data
   * @returns {Promise<Object>} Transfer transaction data
   */
  async createTokenTransferTransaction(transferData) {
    const {
      walletId,
      tokenAddress,
      toAddress,
      amount,
      gasLimit,
      gasPrice,
      nonce,
      chainId = 1,
    } = transferData;

    try {
      // ERC-20 transfer function signature and data
      const transferSignature = '0xa9059cbb'; // transfer(address,uint256)
      const paddedToAddress = toAddress.slice(2).padStart(64, '0');
      const paddedAmount = amount.toString(16).padStart(64, '0');
      const data = transferSignature + paddedToAddress + paddedAmount;

      const transactionData = {
        to: tokenAddress,
        value: '0x0',
        data,
        gasLimit: gasLimit || '0x15F90', // 90,000 gas
        gasPrice: gasPrice || '0x9502F9000', // 40 Gwei
        nonce: nonce || '0x0',
        chainId,
      };

      const signedTx = await this.signTransaction({
        walletId,
        unsignedTransaction: transactionData,
      });

      return {
        ...signedTx,
        transactionData,
        transferType: 'TOKEN_TRANSFER',
        tokenAddress,
        toAddress,
        amount,
      };
    } catch (error) {
      throw new Error(`Token transfer transaction creation failed: ${error.message}`);
    }
  }

  /**
   * Create an ICO investment transaction
   * @param {Object} investmentData - Investment transaction data
   * @returns {Promise<Object>} Investment transaction data
   */
  async createInvestmentTransaction(investmentData) {
    const {
      walletId,
      icoContractAddress,
      ethAmount,
      gasLimit,
      gasPrice,
      nonce,
      chainId = 1,
    } = investmentData;

    try {
      // ICO investment function (assuming a standard buyTokens function)
      const buyTokensSignature = '0xd0febe4c'; // buyTokens() - common ICO function
      
      const transactionData = {
        to: icoContractAddress,
        value: ethAmount, // ETH amount to invest
        data: buyTokensSignature,
        gasLimit: gasLimit || '0x30D40', // 200,000 gas
        gasPrice: gasPrice || '0x9502F9000', // 40 Gwei
        nonce: nonce || '0x0',
        chainId,
      };

      const signedTx = await this.signTransaction({
        walletId,
        unsignedTransaction: transactionData,
      });

      return {
        ...signedTx,
        transactionData,
        investmentType: 'ICO_INVESTMENT',
        icoContractAddress,
        ethAmount,
      };
    } catch (error) {
      throw new Error(`ICO investment transaction creation failed: ${error.message}`);
    }
  }

  /**
   * Batch sign multiple transactions
   * @param {Array} transactions - Array of transaction data
   * @returns {Promise<Array>} Array of signed transactions
   */
  async batchSignTransactions(transactions) {
    const signPromises = transactions.map(tx => 
      this.signTransaction(tx).catch(error => ({ error: error.message, ...tx }))
    );
    
    return Promise.all(signPromises);
  }

  /**
   * Export wallet public key
   * @param {string} walletId - Wallet ID
   * @returns {Promise<Object>} Public key information
   */
  async exportPublicKey(walletId) {
    return retryRequest(async () => {
      const response = await this.client.post('/export', {
        walletId,
        exportType: 'EXPORT_TYPE_PUBLIC_KEY',
      });
      
      return {
        publicKey: response.data.publicKey,
        address: response.data.address,
        compressed: response.data.compressed,
      };
    });
  }

  /**
   * Create a sub-organization wallet
   * @param {Object} subOrgData - Sub-organization data
   * @returns {Promise<Object>} Sub-organization wallet
   */
  async createSubOrganizationWallet(subOrgData) {
    return retryRequest(async () => {
      const response = await this.client.post('/sub-organizations', {
        subOrganizationName: subOrgData.name,
        rootUsers: subOrgData.rootUsers || [],
        rootQuorumThreshold: subOrgData.quorumThreshold || 1,
        wallet: {
          walletName: `${subOrgData.name}-Wallet`,
          accounts: [{
            curve: 'CURVE_SECP256K1',
            pathFormat: 'PATH_FORMAT_BIP32',
            path: "m/44'/60'/0'/0/0",
            addressFormat: 'ADDRESS_FORMAT_ETHEREUM',
          }],
        },
      });
      
      return response.data;
    });
  }

  /**
   * Get wallet activity/transactions
   * @param {string} walletId - Wallet ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Wallet activity
   */
  async getWalletActivity(walletId, options = {}) {
    return retryRequest(async () => {
      const params = new URLSearchParams();
      
      if (options.limit) {
        params.append('limit', options.limit);
      }
      
      if (options.cursor) {
        params.append('cursor', options.cursor);
      }
      
      if (options.status) {
        params.append('status', options.status);
      }
      
      const response = await this.client.get(`/wallets/${walletId}/activities?${params.toString()}`);
      return response.data.activities || [];
    });
  }

  /**
   * Validate wallet address
   * @param {string} address - Address to validate
   * @returns {boolean} True if valid Ethereum address
   */
  isValidAddress(address) {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  /**
   * Encode constructor parameters for contract deployment
   * @param {Array} params - Constructor parameters
   * @returns {string} Encoded parameters
   */
  encodeConstructorParams(params) {
    if (!params || params.length === 0) {
      return '';
    }
    
    // Simple encoding for basic types (string, uint256, address)
    // In production, use a proper ABI encoder like ethers.js
    return params.map(param => {
      if (typeof param === 'string' && param.startsWith('0x')) {
        // Address or hex value
        return param.slice(2).padStart(64, '0');
      } else if (typeof param === 'number' || typeof param === 'bigint') {
        // Number
        return param.toString(16).padStart(64, '0');
      } else if (typeof param === 'string') {
        // String - convert to hex
        const hex = Buffer.from(param, 'utf8').toString('hex');
        return hex.padStart(64, '0');
      }
      return '';
    }).join('');
  }

  /**
   * Get wallet balance (requires integration with blockchain service)
   * @param {string} walletId - Wallet ID
   * @param {string} tokenAddress - Token contract address (optional)
   * @returns {Promise<Object>} Balance information
   */
  async getWalletBalance(walletId, tokenAddress = null) {
    try {
      const wallet = await this.getWallet(walletId);
      const address = wallet.accounts[0].address;
      
      // This would typically integrate with AlchemyService or similar
      // For now, return a placeholder structure
      return {
        address,
        balance: '0',
        tokenAddress,
        symbol: tokenAddress ? 'TOKEN' : 'ETH',
        decimals: tokenAddress ? 18 : 18,
      };
    } catch (error) {
      throw new Error(`Failed to get wallet balance: ${error.message}`);
    }
  }

  /**
   * Create a multi-signature wallet
   * @param {Object} multiSigData - Multi-signature wallet data
   * @returns {Promise<Object>} Multi-signature wallet
   */
  async createMultiSigWallet(multiSigData) {
    return retryRequest(async () => {
      const { name, owners, threshold } = multiSigData;
      
      const response = await this.client.post('/wallets/create', {
        walletName: name,
        accounts: [{
          curve: 'CURVE_SECP256K1',
          pathFormat: 'PATH_FORMAT_BIP32',
          path: "m/44'/60'/0'/0/0",
          addressFormat: 'ADDRESS_FORMAT_ETHEREUM',
        }],
        policy: {
          effect: 'EFFECT_ALLOW',
          consensus: 'CONSENSUS_THRESHOLD',
          condition: `approvers.any(user, user.id in [${owners.map(id => `"${id}"`).join(', ')}]) && approvers.count() >= ${threshold}`,
        },
      });
      
      return {
        walletId: response.data.walletId,
        address: response.data.accounts[0].address,
        owners,
        threshold,
        multiSig: true,
      };
    });
  }
}

export default new TurnkeyService();

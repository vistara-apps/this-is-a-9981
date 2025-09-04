import axios from 'axios';
import { API_CONFIG, handleApiError, retryRequest } from './index';

/**
 * Alchemy Service for blockchain interactions
 * Provides methods for token creation, contract deployment, and blockchain queries
 */
class AlchemyService {
  constructor() {
    this.apiKey = API_CONFIG.apiKeys.alchemy;
    this.baseURL = API_CONFIG.endpoints.alchemy;
    
    // Create axios instance with default configuration
    this.client = axios.create({
      timeout: API_CONFIG.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // Add request interceptor for API key
    this.client.interceptors.request.use((config) => {
      if (this.apiKey) {
        config.url = `${this.baseURL}/${this.apiKey}${config.url}`;
      }
      return config;
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
   * Get the current gas price for a network
   * @param {string} network - Network name (mainnet, polygon, etc.)
   * @returns {Promise<string>} Gas price in wei
   */
  async getGasPrice(network = 'mainnet') {
    return retryRequest(async () => {
      const response = await this.client.post('', {
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_gasPrice',
        params: [],
      });
      
      return response.data.result;
    });
  }

  /**
   * Estimate gas for a transaction
   * @param {Object} transaction - Transaction object
   * @returns {Promise<string>} Estimated gas limit
   */
  async estimateGas(transaction) {
    return retryRequest(async () => {
      const response = await this.client.post('', {
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_estimateGas',
        params: [transaction],
      });
      
      return response.data.result;
    });
  }

  /**
   * Get account balance
   * @param {string} address - Wallet address
   * @param {string} blockTag - Block tag (latest, earliest, pending)
   * @returns {Promise<string>} Balance in wei
   */
  async getBalance(address, blockTag = 'latest') {
    return retryRequest(async () => {
      const response = await this.client.post('', {
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_getBalance',
        params: [address, blockTag],
      });
      
      return response.data.result;
    });
  }

  /**
   * Get transaction count (nonce) for an address
   * @param {string} address - Wallet address
   * @param {string} blockTag - Block tag
   * @returns {Promise<string>} Transaction count
   */
  async getTransactionCount(address, blockTag = 'latest') {
    return retryRequest(async () => {
      const response = await this.client.post('', {
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_getTransactionCount',
        params: [address, blockTag],
      });
      
      return response.data.result;
    });
  }

  /**
   * Send a raw transaction
   * @param {string} signedTransaction - Signed transaction hex
   * @returns {Promise<string>} Transaction hash
   */
  async sendRawTransaction(signedTransaction) {
    return retryRequest(async () => {
      const response = await this.client.post('', {
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_sendRawTransaction',
        params: [signedTransaction],
      });
      
      return response.data.result;
    });
  }

  /**
   * Get transaction receipt
   * @param {string} transactionHash - Transaction hash
   * @returns {Promise<Object>} Transaction receipt
   */
  async getTransactionReceipt(transactionHash) {
    return retryRequest(async () => {
      const response = await this.client.post('', {
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_getTransactionReceipt',
        params: [transactionHash],
      });
      
      return response.data.result;
    });
  }

  /**
   * Call a contract method (read-only)
   * @param {Object} callObject - Call object with to, data, etc.
   * @param {string} blockTag - Block tag
   * @returns {Promise<string>} Call result
   */
  async call(callObject, blockTag = 'latest') {
    return retryRequest(async () => {
      const response = await this.client.post('', {
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_call',
        params: [callObject, blockTag],
      });
      
      return response.data.result;
    });
  }

  /**
   * Get contract logs
   * @param {Object} filterObject - Filter object with address, topics, etc.
   * @returns {Promise<Array>} Array of logs
   */
  async getLogs(filterObject) {
    return retryRequest(async () => {
      const response = await this.client.post('', {
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_getLogs',
        params: [filterObject],
      });
      
      return response.data.result;
    });
  }

  /**
   * Deploy a smart contract
   * @param {Object} deploymentData - Contract deployment data
   * @returns {Promise<Object>} Deployment result with transaction hash and contract address
   */
  async deployContract(deploymentData) {
    const { bytecode, abi, constructorParams, from, gasLimit, gasPrice } = deploymentData;
    
    try {
      // Estimate gas if not provided
      const estimatedGas = gasLimit || await this.estimateGas({
        from,
        data: bytecode,
        value: '0x0',
      });

      // Get current gas price if not provided
      const currentGasPrice = gasPrice || await this.getGasPrice();

      // Get nonce
      const nonce = await this.getTransactionCount(from);

      return {
        estimatedGas,
        gasPrice: currentGasPrice,
        nonce,
        bytecode,
        abi,
        constructorParams,
      };
    } catch (error) {
      throw new Error(`Contract deployment preparation failed: ${error.message}`);
    }
  }

  /**
   * Get token information from contract
   * @param {string} contractAddress - Token contract address
   * @returns {Promise<Object>} Token information
   */
  async getTokenInfo(contractAddress) {
    try {
      // Standard ERC-20 function signatures
      const nameSignature = '0x06fdde03'; // name()
      const symbolSignature = '0x95d89b41'; // symbol()
      const decimalsSignature = '0x313ce567'; // decimals()
      const totalSupplySignature = '0x18160ddd'; // totalSupply()

      const [name, symbol, decimals, totalSupply] = await Promise.all([
        this.call({ to: contractAddress, data: nameSignature }),
        this.call({ to: contractAddress, data: symbolSignature }),
        this.call({ to: contractAddress, data: decimalsSignature }),
        this.call({ to: contractAddress, data: totalSupplySignature }),
      ]);

      return {
        name: this.decodeString(name),
        symbol: this.decodeString(symbol),
        decimals: parseInt(decimals, 16),
        totalSupply: parseInt(totalSupply, 16).toString(),
        contractAddress,
      };
    } catch (error) {
      throw new Error(`Failed to get token info: ${error.message}`);
    }
  }

  /**
   * Get token balance for an address
   * @param {string} contractAddress - Token contract address
   * @param {string} walletAddress - Wallet address
   * @returns {Promise<string>} Token balance
   */
  async getTokenBalance(contractAddress, walletAddress) {
    try {
      // balanceOf(address) function signature
      const balanceOfSignature = '0x70a08231';
      const paddedAddress = walletAddress.slice(2).padStart(64, '0');
      const data = balanceOfSignature + paddedAddress;

      const result = await this.call({
        to: contractAddress,
        data,
      });

      return parseInt(result, 16).toString();
    } catch (error) {
      throw new Error(`Failed to get token balance: ${error.message}`);
    }
  }

  /**
   * Monitor transaction status
   * @param {string} transactionHash - Transaction hash to monitor
   * @param {number} maxAttempts - Maximum polling attempts
   * @param {number} interval - Polling interval in milliseconds
   * @returns {Promise<Object>} Transaction receipt when confirmed
   */
  async waitForTransaction(transactionHash, maxAttempts = 60, interval = 5000) {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const receipt = await this.getTransactionReceipt(transactionHash);
        
        if (receipt) {
          return receipt;
        }
        
        // Wait before next attempt
        await new Promise(resolve => setTimeout(resolve, interval));
      } catch (error) {
        if (attempt === maxAttempts - 1) {
          throw new Error(`Transaction monitoring failed: ${error.message}`);
        }
      }
    }
    
    throw new Error('Transaction confirmation timeout');
  }

  /**
   * Decode hex string to UTF-8
   * @param {string} hex - Hex string
   * @returns {string} Decoded string
   */
  decodeString(hex) {
    if (!hex || hex === '0x') return '';
    
    try {
      // Remove 0x prefix and decode
      const cleanHex = hex.slice(2);
      const bytes = [];
      
      for (let i = 0; i < cleanHex.length; i += 2) {
        bytes.push(parseInt(cleanHex.substr(i, 2), 16));
      }
      
      // Convert bytes to string, removing null bytes
      return String.fromCharCode(...bytes.filter(b => b !== 0));
    } catch (error) {
      return '';
    }
  }

  /**
   * Validate Ethereum address
   * @param {string} address - Address to validate
   * @returns {boolean} True if valid
   */
  isValidAddress(address) {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  /**
   * Convert wei to ether
   * @param {string} wei - Wei amount
   * @returns {string} Ether amount
   */
  weiToEther(wei) {
    const weiValue = BigInt(wei);
    const etherValue = weiValue / BigInt('1000000000000000000');
    return etherValue.toString();
  }

  /**
   * Convert ether to wei
   * @param {string} ether - Ether amount
   * @returns {string} Wei amount
   */
  etherToWei(ether) {
    const etherValue = parseFloat(ether);
    const weiValue = BigInt(Math.floor(etherValue * 1e18));
    return weiValue.toString();
  }
}

export default new AlchemyService();

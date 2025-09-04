import axios from 'axios';
import { API_CONFIG, handleApiError, retryRequest } from './index';

/**
 * Pinata Service for IPFS storage and metadata management
 * Provides methods for uploading files and JSON metadata to IPFS
 */
class PinataService {
  constructor() {
    this.apiKey = API_CONFIG.apiKeys.pinata;
    this.baseURL = API_CONFIG.endpoints.pinata;
    
    // Create axios instance with default configuration
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: API_CONFIG.timeout,
      headers: {
        'pinata_api_key': this.apiKey,
        'pinata_secret_api_key': process.env.VITE_PINATA_SECRET_KEY,
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
   * Pin JSON metadata to IPFS
   * @param {Object} jsonData - JSON data to pin
   * @param {Object} options - Pinning options
   * @returns {Promise<Object>} Pinning result
   */
  async pinJSONToIPFS(jsonData, options = {}) {
    return retryRequest(async () => {
      const response = await this.client.post('/pinning/pinJSONToIPFS', {
        pinataContent: jsonData,
        pinataMetadata: {
          name: options.name || 'ICO Factory Metadata',
          keyvalues: options.keyvalues || {},
        },
        pinataOptions: {
          cidVersion: options.cidVersion || 1,
          wrapWithDirectory: options.wrapWithDirectory || false,
        },
      });
      
      return {
        ipfsHash: response.data.IpfsHash,
        pinSize: response.data.PinSize,
        timestamp: response.data.Timestamp,
        url: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`,
      };
    });
  }

  /**
   * Pin file to IPFS
   * @param {File|Blob} file - File to pin
   * @param {Object} options - Pinning options
   * @returns {Promise<Object>} Pinning result
   */
  async pinFileToIPFS(file, options = {}) {
    return retryRequest(async () => {
      const formData = new FormData();
      formData.append('file', file);
      
      if (options.name) {
        formData.append('pinataMetadata', JSON.stringify({
          name: options.name,
          keyvalues: options.keyvalues || {},
        }));
      }
      
      if (options.cidVersion || options.wrapWithDirectory) {
        formData.append('pinataOptions', JSON.stringify({
          cidVersion: options.cidVersion || 1,
          wrapWithDirectory: options.wrapWithDirectory || false,
        }));
      }
      
      const response = await this.client.post('/pinning/pinFileToIPFS', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return {
        ipfsHash: response.data.IpfsHash,
        pinSize: response.data.PinSize,
        timestamp: response.data.Timestamp,
        url: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`,
      };
    });
  }

  /**
   * Create token metadata and pin to IPFS
   * @param {Object} tokenData - Token information
   * @returns {Promise<Object>} Metadata pinning result
   */
  async createTokenMetadata(tokenData) {
    const metadata = {
      name: tokenData.name,
      symbol: tokenData.symbol,
      description: tokenData.description || `${tokenData.name} (${tokenData.symbol}) token created with ICO Factory`,
      decimals: tokenData.decimals || 18,
      totalSupply: tokenData.totalSupply,
      image: tokenData.imageUrl || '',
      external_url: tokenData.website || '',
      attributes: [
        {
          trait_type: 'Network',
          value: tokenData.network || 'Ethereum',
        },
        {
          trait_type: 'Created By',
          value: 'ICO Factory',
        },
        {
          trait_type: 'Creation Date',
          value: new Date().toISOString(),
        },
      ],
      properties: {
        contract_address: tokenData.contractAddress || '',
        creator: tokenData.creator || '',
        category: 'utility',
      },
    };

    return this.pinJSONToIPFS(metadata, {
      name: `${tokenData.name} Token Metadata`,
      keyvalues: {
        type: 'token_metadata',
        symbol: tokenData.symbol,
        network: tokenData.network || 'ethereum',
      },
    });
  }

  /**
   * Create ICO campaign metadata and pin to IPFS
   * @param {Object} campaignData - ICO campaign information
   * @returns {Promise<Object>} Metadata pinning result
   */
  async createICOMetadata(campaignData) {
    const metadata = {
      name: campaignData.name || `${campaignData.tokenName} ICO`,
      description: campaignData.description || `Initial Coin Offering for ${campaignData.tokenName}`,
      token: {
        name: campaignData.tokenName,
        symbol: campaignData.tokenSymbol,
        address: campaignData.tokenAddress,
      },
      campaign: {
        startDate: campaignData.startDate,
        endDate: campaignData.endDate,
        fundraisingGoal: campaignData.fundraisingGoal,
        tokenPrice: campaignData.tokenPrice,
        cap: campaignData.cap,
      },
      team: campaignData.team || [],
      roadmap: campaignData.roadmap || [],
      whitepaper: campaignData.whitepaperUrl || '',
      website: campaignData.website || '',
      social: {
        twitter: campaignData.twitter || '',
        telegram: campaignData.telegram || '',
        discord: campaignData.discord || '',
      },
      legal: {
        jurisdiction: campaignData.jurisdiction || '',
        compliance: campaignData.compliance || [],
      },
    };

    return this.pinJSONToIPFS(metadata, {
      name: `${campaignData.tokenName} ICO Metadata`,
      keyvalues: {
        type: 'ico_metadata',
        token_symbol: campaignData.tokenSymbol,
        campaign_id: campaignData.campaignId,
      },
    });
  }

  /**
   * Get pinned content by hash
   * @param {string} ipfsHash - IPFS hash
   * @returns {Promise<Object>} Content data
   */
  async getContent(ipfsHash) {
    return retryRequest(async () => {
      const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`);
      return response.data;
    });
  }

  /**
   * List pinned files
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>} List of pinned files
   */
  async listPinnedFiles(filters = {}) {
    return retryRequest(async () => {
      const params = new URLSearchParams();
      
      if (filters.status) {
        params.append('status', filters.status);
      }
      
      if (filters.pageLimit) {
        params.append('pageLimit', filters.pageLimit);
      }
      
      if (filters.pageOffset) {
        params.append('pageOffset', filters.pageOffset);
      }
      
      if (filters.metadata) {
        Object.entries(filters.metadata).forEach(([key, value]) => {
          params.append(`metadata[keyvalues][${key}]`, value);
        });
      }
      
      const response = await this.client.get(`/data/pinList?${params.toString()}`);
      return response.data.rows || [];
    });
  }

  /**
   * Unpin content from IPFS
   * @param {string} ipfsHash - IPFS hash to unpin
   * @returns {Promise<boolean>} Success status
   */
  async unpinContent(ipfsHash) {
    return retryRequest(async () => {
      await this.client.delete(`/pinning/unpin/${ipfsHash}`);
      return true;
    });
  }

  /**
   * Update metadata for pinned content
   * @param {string} ipfsHash - IPFS hash
   * @param {Object} metadata - New metadata
   * @returns {Promise<boolean>} Success status
   */
  async updateMetadata(ipfsHash, metadata) {
    return retryRequest(async () => {
      await this.client.put(`/pinning/hashMetadata`, {
        ipfsPinHash: ipfsHash,
        name: metadata.name,
        keyvalues: metadata.keyvalues || {},
      });
      return true;
    });
  }

  /**
   * Test authentication
   * @returns {Promise<boolean>} Authentication status
   */
  async testAuthentication() {
    try {
      const response = await this.client.get('/data/testAuthentication');
      return response.data.message === 'Congratulations! You are communicating with the Pinata API!';
    } catch (error) {
      return false;
    }
  }

  /**
   * Get account usage statistics
   * @returns {Promise<Object>} Usage statistics
   */
  async getUsageStats() {
    return retryRequest(async () => {
      const response = await this.client.get('/data/userPinnedDataTotal');
      return {
        pinCount: response.data.pin_count,
        pinSizeTotal: response.data.pin_size_total,
        pinSizeWithReplicationsTotal: response.data.pin_size_with_replications_total,
      };
    });
  }

  /**
   * Create and pin project documentation
   * @param {Object} projectData - Project information
   * @returns {Promise<Object>} Documentation pinning result
   */
  async createProjectDocumentation(projectData) {
    const documentation = {
      project: {
        name: projectData.name,
        version: projectData.version || '1.0.0',
        description: projectData.description,
        created: new Date().toISOString(),
      },
      token: {
        name: projectData.tokenName,
        symbol: projectData.tokenSymbol,
        totalSupply: projectData.totalSupply,
        decimals: projectData.decimals,
        contractAddress: projectData.contractAddress,
      },
      ico: {
        startDate: projectData.icoStartDate,
        endDate: projectData.icoEndDate,
        fundraisingGoal: projectData.fundraisingGoal,
        tokenPrice: projectData.tokenPrice,
      },
      technical: {
        blockchain: projectData.blockchain || 'Ethereum',
        standards: ['ERC-20'],
        audited: projectData.audited || false,
        auditReport: projectData.auditReportUrl || '',
      },
      legal: {
        jurisdiction: projectData.jurisdiction,
        compliance: projectData.compliance || [],
        disclaimer: 'This token offering may be subject to regulatory requirements. Please consult with legal counsel.',
      },
    };

    return this.pinJSONToIPFS(documentation, {
      name: `${projectData.name} Project Documentation`,
      keyvalues: {
        type: 'project_documentation',
        project_name: projectData.name,
        version: projectData.version || '1.0.0',
      },
    });
  }

  /**
   * Generate IPFS URL from hash
   * @param {string} ipfsHash - IPFS hash
   * @param {string} gateway - Gateway URL (optional)
   * @returns {string} Full IPFS URL
   */
  generateIPFSUrl(ipfsHash, gateway = 'https://gateway.pinata.cloud') {
    return `${gateway}/ipfs/${ipfsHash}`;
  }

  /**
   * Validate IPFS hash format
   * @param {string} hash - Hash to validate
   * @returns {boolean} True if valid IPFS hash
   */
  isValidIPFSHash(hash) {
    // Basic validation for IPFS hash (CIDv0 and CIDv1)
    return /^(Qm[1-9A-HJ-NP-Za-km-z]{44}|b[A-Za-z2-7]{58}|B[A-Z2-7]{58}|z[1-9A-HJ-NP-Za-km-z]{48})$/.test(hash);
  }
}

export default new PinataService();

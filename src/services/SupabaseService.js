import axios from 'axios';
import { API_CONFIG, handleApiError, retryRequest } from './index';

/**
 * Supabase Service for database operations
 * Provides methods for CRUD operations on all entities defined in the PRD
 */
class SupabaseService {
  constructor() {
    this.apiKey = API_CONFIG.apiKeys.supabase;
    this.baseURL = API_CONFIG.endpoints.supabase;
    
    // Create axios instance with default configuration
    this.client = axios.create({
      baseURL: `${this.baseURL}/rest/v1`,
      timeout: API_CONFIG.timeout,
      headers: {
        'Content-Type': 'application/json',
        'apikey': this.apiKey,
        'Authorization': `Bearer ${this.apiKey}`,
        'Prefer': 'return=representation',
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

  // ==================== USER OPERATIONS ====================

  /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Created user
   */
  async createUser(userData) {
    return retryRequest(async () => {
      const response = await this.client.post('/users', {
        ...userData,
        created_at: new Date().toISOString(),
      });
      return response.data[0];
    });
  }

  /**
   * Get user by ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User data
   */
  async getUser(userId) {
    return retryRequest(async () => {
      const response = await this.client.get(`/users?user_id=eq.${userId}&select=*`);
      return response.data[0];
    });
  }

  /**
   * Get user by email
   * @param {string} email - User email
   * @returns {Promise<Object>} User data
   */
  async getUserByEmail(email) {
    return retryRequest(async () => {
      const response = await this.client.get(`/users?email=eq.${email}&select=*`);
      return response.data[0];
    });
  }

  /**
   * Update user
   * @param {string} userId - User ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated user
   */
  async updateUser(userId, updateData) {
    return retryRequest(async () => {
      const response = await this.client.patch(`/users?user_id=eq.${userId}`, updateData);
      return response.data[0];
    });
  }

  /**
   * Delete user
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteUser(userId) {
    return retryRequest(async () => {
      await this.client.delete(`/users?user_id=eq.${userId}`);
      return true;
    });
  }

  // ==================== TOKEN OPERATIONS ====================

  /**
   * Create a new token
   * @param {Object} tokenData - Token data
   * @returns {Promise<Object>} Created token
   */
  async createToken(tokenData) {
    return retryRequest(async () => {
      const response = await this.client.post('/tokens', {
        ...tokenData,
        created_at: new Date().toISOString(),
      });
      return response.data[0];
    });
  }

  /**
   * Get token by ID
   * @param {string} tokenId - Token ID
   * @returns {Promise<Object>} Token data
   */
  async getToken(tokenId) {
    return retryRequest(async () => {
      const response = await this.client.get(`/tokens?token_id=eq.${tokenId}&select=*`);
      return response.data[0];
    });
  }

  /**
   * Get tokens by user ID
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Array of tokens
   */
  async getTokensByUser(userId) {
    return retryRequest(async () => {
      const response = await this.client.get(`/tokens?user_id=eq.${userId}&select=*&order=created_at.desc`);
      return response.data;
    });
  }

  /**
   * Update token
   * @param {string} tokenId - Token ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated token
   */
  async updateToken(tokenId, updateData) {
    return retryRequest(async () => {
      const response = await this.client.patch(`/tokens?token_id=eq.${tokenId}`, updateData);
      return response.data[0];
    });
  }

  /**
   * Delete token
   * @param {string} tokenId - Token ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteToken(tokenId) {
    return retryRequest(async () => {
      await this.client.delete(`/tokens?token_id=eq.${tokenId}`);
      return true;
    });
  }

  // ==================== ICO CAMPAIGN OPERATIONS ====================

  /**
   * Create a new ICO campaign
   * @param {Object} campaignData - Campaign data
   * @returns {Promise<Object>} Created campaign
   */
  async createCampaign(campaignData) {
    return retryRequest(async () => {
      const response = await this.client.post('/ico_campaigns', {
        ...campaignData,
        created_at: new Date().toISOString(),
      });
      return response.data[0];
    });
  }

  /**
   * Get campaign by ID
   * @param {string} campaignId - Campaign ID
   * @returns {Promise<Object>} Campaign data
   */
  async getCampaign(campaignId) {
    return retryRequest(async () => {
      const response = await this.client.get(`/ico_campaigns?campaign_id=eq.${campaignId}&select=*,tokens(*)`);
      return response.data[0];
    });
  }

  /**
   * Get campaigns by token ID
   * @param {string} tokenId - Token ID
   * @returns {Promise<Array>} Array of campaigns
   */
  async getCampaignsByToken(tokenId) {
    return retryRequest(async () => {
      const response = await this.client.get(`/ico_campaigns?token_id=eq.${tokenId}&select=*&order=created_at.desc`);
      return response.data;
    });
  }

  /**
   * Get campaigns by user ID
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Array of campaigns
   */
  async getCampaignsByUser(userId) {
    return retryRequest(async () => {
      const response = await this.client.get(`/ico_campaigns?select=*,tokens!inner(user_id)&tokens.user_id=eq.${userId}&order=created_at.desc`);
      return response.data;
    });
  }

  /**
   * Update campaign
   * @param {string} campaignId - Campaign ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated campaign
   */
  async updateCampaign(campaignId, updateData) {
    return retryRequest(async () => {
      const response = await this.client.patch(`/ico_campaigns?campaign_id=eq.${campaignId}`, updateData);
      return response.data[0];
    });
  }

  /**
   * Delete campaign
   * @param {string} campaignId - Campaign ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteCampaign(campaignId) {
    return retryRequest(async () => {
      await this.client.delete(`/ico_campaigns?campaign_id=eq.${campaignId}`);
      return true;
    });
  }

  // ==================== INVESTOR OPERATIONS ====================

  /**
   * Create a new investor record
   * @param {Object} investorData - Investor data
   * @returns {Promise<Object>} Created investor
   */
  async createInvestor(investorData) {
    return retryRequest(async () => {
      const response = await this.client.post('/investors', {
        ...investorData,
        created_at: new Date().toISOString(),
      });
      return response.data[0];
    });
  }

  /**
   * Get investor by ID
   * @param {string} investorId - Investor ID
   * @returns {Promise<Object>} Investor data
   */
  async getInvestor(investorId) {
    return retryRequest(async () => {
      const response = await this.client.get(`/investors?investor_id=eq.${investorId}&select=*`);
      return response.data[0];
    });
  }

  /**
   * Get investors by token ID
   * @param {string} tokenId - Token ID
   * @returns {Promise<Array>} Array of investors
   */
  async getInvestorsByToken(tokenId) {
    return retryRequest(async () => {
      const response = await this.client.get(`/investors?token_id=eq.${tokenId}&select=*&order=amount_invested.desc`);
      return response.data;
    });
  }

  /**
   * Get investor by wallet address and token
   * @param {string} walletAddress - Wallet address
   * @param {string} tokenId - Token ID
   * @returns {Promise<Object>} Investor data
   */
  async getInvestorByWallet(walletAddress, tokenId) {
    return retryRequest(async () => {
      const response = await this.client.get(`/investors?wallet_address=eq.${walletAddress}&token_id=eq.${tokenId}&select=*`);
      return response.data[0];
    });
  }

  /**
   * Update investor
   * @param {string} investorId - Investor ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated investor
   */
  async updateInvestor(investorId, updateData) {
    return retryRequest(async () => {
      const response = await this.client.patch(`/investors?investor_id=eq.${investorId}`, updateData);
      return response.data[0];
    });
  }

  /**
   * Delete investor
   * @param {string} investorId - Investor ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteInvestor(investorId) {
    return retryRequest(async () => {
      await this.client.delete(`/investors?investor_id=eq.${investorId}`);
      return true;
    });
  }

  // ==================== VESTING SCHEDULE OPERATIONS ====================

  /**
   * Create a new vesting schedule
   * @param {Object} vestingData - Vesting schedule data
   * @returns {Promise<Object>} Created vesting schedule
   */
  async createVestingSchedule(vestingData) {
    return retryRequest(async () => {
      const response = await this.client.post('/vesting_schedules', {
        ...vestingData,
        created_at: new Date().toISOString(),
      });
      return response.data[0];
    });
  }

  /**
   * Get vesting schedule by ID
   * @param {string} vestingId - Vesting schedule ID
   * @returns {Promise<Object>} Vesting schedule data
   */
  async getVestingSchedule(vestingId) {
    return retryRequest(async () => {
      const response = await this.client.get(`/vesting_schedules?vesting_id=eq.${vestingId}&select=*`);
      return response.data[0];
    });
  }

  /**
   * Get vesting schedules by token ID
   * @param {string} tokenId - Token ID
   * @returns {Promise<Array>} Array of vesting schedules
   */
  async getVestingSchedulesByToken(tokenId) {
    return retryRequest(async () => {
      const response = await this.client.get(`/vesting_schedules?token_id=eq.${tokenId}&select=*&order=start_time.asc`);
      return response.data;
    });
  }

  /**
   * Get vesting schedules by investor ID
   * @param {string} investorId - Investor ID
   * @returns {Promise<Array>} Array of vesting schedules
   */
  async getVestingSchedulesByInvestor(investorId) {
    return retryRequest(async () => {
      const response = await this.client.get(`/vesting_schedules?investor_id=eq.${investorId}&select=*&order=start_time.asc`);
      return response.data;
    });
  }

  /**
   * Update vesting schedule
   * @param {string} vestingId - Vesting schedule ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated vesting schedule
   */
  async updateVestingSchedule(vestingId, updateData) {
    return retryRequest(async () => {
      const response = await this.client.patch(`/vesting_schedules?vesting_id=eq.${vestingId}`, updateData);
      return response.data[0];
    });
  }

  /**
   * Delete vesting schedule
   * @param {string} vestingId - Vesting schedule ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteVestingSchedule(vestingId) {
    return retryRequest(async () => {
      await this.client.delete(`/vesting_schedules?vesting_id=eq.${vestingId}`);
      return true;
    });
  }

  // ==================== ANALYTICS AND REPORTING ====================

  /**
   * Get dashboard analytics for a user
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Analytics data
   */
  async getDashboardAnalytics(userId) {
    return retryRequest(async () => {
      const [tokens, campaigns, investors] = await Promise.all([
        this.getTokensByUser(userId),
        this.getCampaignsByUser(userId),
        this.client.get(`/investors?select=*,tokens!inner(user_id)&tokens.user_id=eq.${userId}`)
      ]);

      const totalRaised = campaigns.reduce((sum, campaign) => sum + parseFloat(campaign.raised || 0), 0);
      const activeCampaigns = campaigns.filter(c => c.current_state === 'active').length;
      const totalInvestors = investors.data.length;

      return {
        totalTokens: tokens.length,
        totalCampaigns: campaigns.length,
        activeCampaigns,
        totalRaised,
        totalInvestors,
        tokens,
        campaigns,
        investors: investors.data,
      };
    });
  }

  /**
   * Get token distribution data
   * @param {string} tokenId - Token ID
   * @returns {Promise<Array>} Distribution data
   */
  async getTokenDistribution(tokenId) {
    return retryRequest(async () => {
      const investors = await this.getInvestorsByToken(tokenId);
      const token = await this.getToken(tokenId);
      
      if (!token) {
        throw new Error('Token not found');
      }

      const totalSupply = parseFloat(token.total_supply);
      const totalDistributed = investors.reduce((sum, investor) => sum + parseFloat(investor.tokens_held || 0), 0);
      const remaining = totalSupply - totalDistributed;

      return [
        { name: 'Distributed', value: (totalDistributed / totalSupply) * 100, amount: totalDistributed },
        { name: 'Remaining', value: (remaining / totalSupply) * 100, amount: remaining },
      ];
    });
  }

  // ==================== BULK OPERATIONS ====================

  /**
   * Bulk create investors
   * @param {Array} investorsData - Array of investor data
   * @returns {Promise<Array>} Created investors
   */
  async bulkCreateInvestors(investorsData) {
    return retryRequest(async () => {
      const dataWithTimestamps = investorsData.map(investor => ({
        ...investor,
        created_at: new Date().toISOString(),
      }));
      
      const response = await this.client.post('/investors', dataWithTimestamps);
      return response.data;
    });
  }

  /**
   * Bulk update investors
   * @param {Array} updates - Array of {id, data} objects
   * @returns {Promise<Array>} Updated investors
   */
  async bulkUpdateInvestors(updates) {
    const promises = updates.map(({ id, data }) => 
      this.updateInvestor(id, data)
    );
    
    return Promise.all(promises);
  }

  // ==================== SEARCH AND FILTERING ====================

  /**
   * Search tokens with filters
   * @param {Object} filters - Search filters
   * @returns {Promise<Array>} Filtered tokens
   */
  async searchTokens(filters = {}) {
    return retryRequest(async () => {
      let query = '/tokens?select=*';
      
      if (filters.userId) {
        query += `&user_id=eq.${filters.userId}`;
      }
      
      if (filters.network) {
        query += `&blockchain_network=eq.${filters.network}`;
      }
      
      if (filters.search) {
        query += `&or=(token_name.ilike.%${filters.search}%,token_symbol.ilike.%${filters.search}%)`;
      }
      
      query += '&order=created_at.desc';
      
      if (filters.limit) {
        query += `&limit=${filters.limit}`;
      }
      
      const response = await this.client.get(query);
      return response.data;
    });
  }

  /**
   * Search campaigns with filters
   * @param {Object} filters - Search filters
   * @returns {Promise<Array>} Filtered campaigns
   */
  async searchCampaigns(filters = {}) {
    return retryRequest(async () => {
      let query = '/ico_campaigns?select=*,tokens(*)';
      
      if (filters.status) {
        query += `&current_state=eq.${filters.status}`;
      }
      
      if (filters.tokenId) {
        query += `&token_id=eq.${filters.tokenId}`;
      }
      
      query += '&order=created_at.desc';
      
      if (filters.limit) {
        query += `&limit=${filters.limit}`;
      }
      
      const response = await this.client.get(query);
      return response.data;
    });
  }
}

export default new SupabaseService();

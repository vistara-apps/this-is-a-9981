import axios from 'axios';
import { API_CONFIG, handleApiError, retryRequest } from './index';

/**
 * OpenAI Service for AI-powered assistance
 * Provides methods for generating content, explanations, and assistance
 */
class OpenAIService {
  constructor() {
    this.apiKey = API_CONFIG.apiKeys.openai;
    this.baseURL = API_CONFIG.endpoints.openai;
    
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
   * Generate marketing copy for ICO campaigns
   * @param {Object} campaignData - Campaign information
   * @returns {Promise<Object>} Generated marketing content
   */
  async generateMarketingCopy(campaignData) {
    return retryRequest(async () => {
      const prompt = `Create compelling marketing copy for an ICO campaign with the following details:
      
Token Name: ${campaignData.tokenName}
Token Symbol: ${campaignData.tokenSymbol}
Industry: ${campaignData.industry || 'Technology'}
Use Case: ${campaignData.useCase || 'Utility token'}
Fundraising Goal: $${campaignData.fundraisingGoal}
Token Price: $${campaignData.tokenPrice}

Please generate:
1. A compelling headline (max 60 characters)
2. A brief description (max 150 characters)
3. A detailed project description (200-300 words)
4. Key selling points (5 bullet points)
5. Call-to-action text

Make it professional, engaging, and compliant with general marketing standards.`;

      const response = await this.client.post('/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a professional marketing copywriter specializing in blockchain and cryptocurrency projects. Create compelling, professional, and compliant marketing content.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      });

      const content = response.data.choices[0].message.content;
      
      // Parse the response into structured data
      return this.parseMarketingCopy(content);
    });
  }

  /**
   * Generate token description and use case explanation
   * @param {Object} tokenData - Token information
   * @returns {Promise<Object>} Generated token description
   */
  async generateTokenDescription(tokenData) {
    return retryRequest(async () => {
      const prompt = `Create a professional description for a token with these specifications:

Token Name: ${tokenData.tokenName}
Symbol: ${tokenData.tokenSymbol}
Total Supply: ${tokenData.totalSupply}
Decimals: ${tokenData.decimals}
Network: ${tokenData.network || 'Ethereum'}
Purpose: ${tokenData.purpose || 'Utility token'}

Generate:
1. A concise token summary (50-100 words)
2. Technical specifications explanation
3. Use case scenarios (3-5 examples)
4. Benefits for holders

Keep it informative and professional.`;

      const response = await this.client.post('/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a blockchain technical writer. Explain token concepts clearly and professionally.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 800,
        temperature: 0.6,
      });

      return {
        description: response.data.choices[0].message.content,
        generated: true,
        timestamp: new Date().toISOString(),
      };
    });
  }

  /**
   * Explain blockchain concepts to users
   * @param {string} concept - Concept to explain
   * @param {string} level - Explanation level (beginner, intermediate, advanced)
   * @returns {Promise<Object>} Explanation
   */
  async explainConcept(concept, level = 'beginner') {
    return retryRequest(async () => {
      const prompt = `Explain the blockchain/cryptocurrency concept "${concept}" at a ${level} level. 
      
Make it clear, accurate, and appropriate for someone with ${level} knowledge. 
Include practical examples where relevant.
Keep the explanation concise but comprehensive (150-250 words).`;

      const response = await this.client.post('/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a blockchain educator. Provide clear, accurate explanations of blockchain and cryptocurrency concepts.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 500,
        temperature: 0.5,
      });

      return {
        concept,
        level,
        explanation: response.data.choices[0].message.content,
        timestamp: new Date().toISOString(),
      };
    });
  }

  /**
   * Generate smart contract documentation
   * @param {Object} contractData - Contract information
   * @returns {Promise<Object>} Generated documentation
   */
  async generateContractDocumentation(contractData) {
    return retryRequest(async () => {
      const prompt = `Create technical documentation for a smart contract with these details:

Contract Type: ${contractData.type || 'ERC-20 Token'}
Name: ${contractData.name}
Functions: ${contractData.functions?.join(', ') || 'Standard ERC-20 functions'}
Features: ${contractData.features?.join(', ') || 'Basic token functionality'}

Generate:
1. Contract overview
2. Function descriptions
3. Usage examples
4. Security considerations
5. Deployment notes

Make it technical but accessible.`;

      const response = await this.client.post('/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a smart contract developer and technical writer. Create clear, accurate technical documentation.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 1200,
        temperature: 0.4,
      });

      return {
        documentation: response.data.choices[0].message.content,
        contractType: contractData.type,
        generated: true,
        timestamp: new Date().toISOString(),
      };
    });
  }

  /**
   * Generate project roadmap suggestions
   * @param {Object} projectData - Project information
   * @returns {Promise<Object>} Generated roadmap
   */
  async generateRoadmap(projectData) {
    return retryRequest(async () => {
      const prompt = `Create a project roadmap for a blockchain project with these details:

Project: ${projectData.name}
Industry: ${projectData.industry || 'Blockchain'}
Stage: ${projectData.stage || 'Pre-launch'}
Timeline: ${projectData.timeline || '12 months'}
Goals: ${projectData.goals?.join(', ') || 'Token launch, platform development'}

Generate a roadmap with:
1. 4-6 major milestones
2. Realistic timelines
3. Key deliverables for each phase
4. Success metrics

Format as quarterly milestones.`;

      const response = await this.client.post('/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a blockchain project strategist. Create realistic, achievable roadmaps for blockchain projects.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 1000,
        temperature: 0.6,
      });

      return {
        roadmap: response.data.choices[0].message.content,
        projectName: projectData.name,
        generated: true,
        timestamp: new Date().toISOString(),
      };
    });
  }

  /**
   * Analyze and suggest improvements for token economics
   * @param {Object} tokenomics - Tokenomics data
   * @returns {Promise<Object>} Analysis and suggestions
   */
  async analyzeTokenomics(tokenomics) {
    return retryRequest(async () => {
      const prompt = `Analyze the following tokenomics structure and provide suggestions:

Total Supply: ${tokenomics.totalSupply}
Distribution:
- Public Sale: ${tokenomics.publicSale || 'Not specified'}%
- Team: ${tokenomics.team || 'Not specified'}%
- Advisors: ${tokenomics.advisors || 'Not specified'}%
- Reserve: ${tokenomics.reserve || 'Not specified'}%
- Other: ${tokenomics.other || 'Not specified'}%

Vesting: ${tokenomics.vesting || 'Not specified'}
Use Case: ${tokenomics.useCase || 'Not specified'}

Provide:
1. Analysis of the distribution structure
2. Potential risks or concerns
3. Suggestions for improvement
4. Best practices recommendations

Keep it professional and constructive.`;

      const response = await this.client.post('/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a tokenomics expert. Analyze token distribution structures and provide constructive feedback.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 1000,
        temperature: 0.5,
      });

      return {
        analysis: response.data.choices[0].message.content,
        tokenomics,
        generated: true,
        timestamp: new Date().toISOString(),
      };
    });
  }

  /**
   * Generate FAQ content for ICO projects
   * @param {Object} projectData - Project information
   * @returns {Promise<Object>} Generated FAQ
   */
  async generateFAQ(projectData) {
    return retryRequest(async () => {
      const prompt = `Generate a comprehensive FAQ for an ICO project:

Project: ${projectData.name}
Token: ${projectData.tokenName} (${projectData.tokenSymbol})
Industry: ${projectData.industry || 'Blockchain'}
ICO Goal: $${projectData.fundraisingGoal}

Create 10-15 frequently asked questions covering:
- Project basics
- Token details
- ICO process
- Technical aspects
- Legal and compliance
- Investment risks

Provide clear, honest answers.`;

      const response = await this.client.post('/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a blockchain project consultant. Create comprehensive, honest FAQ content for ICO projects.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 1500,
        temperature: 0.6,
      });

      return {
        faq: response.data.choices[0].message.content,
        projectName: projectData.name,
        generated: true,
        timestamp: new Date().toISOString(),
      };
    });
  }

  /**
   * Parse marketing copy response into structured data
   * @param {string} content - Raw AI response
   * @returns {Object} Structured marketing content
   */
  parseMarketingCopy(content) {
    try {
      // Simple parsing logic - in production, use more robust parsing
      const sections = content.split('\n\n');
      
      return {
        headline: this.extractSection(content, 'headline') || 'Launch Your Token Today',
        briefDescription: this.extractSection(content, 'brief description') || 'Revolutionary blockchain solution',
        detailedDescription: this.extractSection(content, 'detailed') || content.substring(0, 300),
        keyPoints: this.extractBulletPoints(content) || [
          'Innovative blockchain technology',
          'Strong development team',
          'Clear roadmap and vision',
          'Transparent tokenomics',
          'Community-driven approach'
        ],
        callToAction: this.extractSection(content, 'call-to-action') || 'Join our ICO today!',
        generated: true,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      // Fallback structure
      return {
        headline: 'Launch Your Token Today',
        briefDescription: 'Revolutionary blockchain solution',
        detailedDescription: content.substring(0, 300),
        keyPoints: ['Innovative technology', 'Strong team', 'Clear vision'],
        callToAction: 'Join our ICO today!',
        generated: true,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Extract specific section from AI response
   * @param {string} content - Full content
   * @param {string} sectionName - Section to extract
   * @returns {string} Extracted section
   */
  extractSection(content, sectionName) {
    const regex = new RegExp(`${sectionName}[:\\s]*([^\n]+)`, 'i');
    const match = content.match(regex);
    return match ? match[1].trim() : null;
  }

  /**
   * Extract bullet points from content
   * @param {string} content - Content with bullet points
   * @returns {Array} Array of bullet points
   */
  extractBulletPoints(content) {
    const bulletRegex = /[•\-\*]\s*([^\n]+)/g;
    const matches = [];
    let match;
    
    while ((match = bulletRegex.exec(content)) !== null) {
      matches.push(match[1].trim());
    }
    
    return matches.length > 0 ? matches : null;
  }

  /**
   * Check if OpenAI service is available
   * @returns {Promise<boolean>} Service availability
   */
  async checkAvailability() {
    try {
      const response = await this.client.get('/models');
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get available models
   * @returns {Promise<Array>} Available models
   */
  async getAvailableModels() {
    return retryRequest(async () => {
      const response = await this.client.get('/models');
      return response.data.data.map(model => ({
        id: model.id,
        created: model.created,
        ownedBy: model.owned_by,
      }));
    });
  }
}

export default new OpenAIService();

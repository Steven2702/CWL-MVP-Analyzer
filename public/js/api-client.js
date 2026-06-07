/**
 * API Client
 * Handles all communication with the backend API
 */

class APIClient {
  constructor() {
    this.baseURL = '/api';
  }

  /**
   * Generic fetch wrapper
   */
  async fetch(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const response = await fetch(url, { ...defaultOptions, ...options });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  /**
   * Analiza la Liga de Guerras de un clan
   * @param {string} clanTag - Tag del clan
   * @returns {Promise<Object>}
   */
  async analyzeCWL(clanTag) {
    return this.fetch('/analyze', {
      method: 'POST',
      body: JSON.stringify({ clanTag })
    });
  }

  /**
   * Obtiene detalles de un jugador
   * @param {string} playerTag - Tag del jugador
   * @returns {Promise<Object>}
   */
  async getPlayerDetails(playerTag) {
    return this.fetch(`/player/${playerTag}`, {
      method: 'GET'
    });
  }

  /**
   * Verificar estado del servidor
   * @returns {Promise<Object>}
   */
  async health() {
    return this.fetch('/health');
  }
}

// Exportar instancia singleton
const apiClient = new APIClient();

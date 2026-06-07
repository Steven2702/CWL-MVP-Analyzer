const axios = require('axios');
const config = require('../config/config');

class ClashAPI {
  constructor() {
    this.baseURL = 'https://api.clashroyale.com/v1';
    this.token = config.CLASH_API_TOKEN;
    this.headers = {
      'Authorization': `Bearer ${this.token}`,
      'Accept': 'application/json'
    };
    
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: this.headers,
      timeout: 10000
    });
  }

  /**
   * Obtiene información del clan por tag
   * @param {string} clanTag - Tag del clan (ej: #2VCVGLJ)
   * @returns {Promise<Object>} Datos del clan
   */
  async getClanInfo(clanTag) {
    try {
      const encodedTag = encodeURIComponent(clanTag);
      const response = await this.client.get(`/clans/${encodedTag}`);
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching clan info: ${error.message}`);
    }
  }

  /**
   * Obtiene la Liga de Guerras del clan
   * @param {string} clanTag - Tag del clan
   * @returns {Promise<Object>} Información de CWL
   */
  async getClanWarLeague(clanTag) {
    try {
      const encodedTag = encodeURIComponent(clanTag);
      const response = await this.client.get(`/clans/${encodedTag}/currentwar/leaguegroup`);
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching CWL: ${error.message}`);
    }
  }

  /**
   * Obtiene una guerra específica
   * @param {string} warTag - Tag de la guerra
   * @returns {Promise<Object>} Datos de la guerra
   */
  async getWar(warTag) {
    try {
      const encodedTag = encodeURIComponent(warTag);
      const response = await this.client.get(`/wars/${encodedTag}`);
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching war: ${error.message}`);
    }
  }

  /**
   * Obtiene información de un miembro
   * @param {string} playerTag - Tag del jugador
   * @returns {Promise<Object>} Datos del jugador
   */
  async getPlayer(playerTag) {
    try {
      const encodedTag = encodeURIComponent(playerTag);
      const response = await this.client.get(`/players/${encodedTag}`);
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching player: ${error.message}`);
    }
  }

  /**
   * Valida el token de API
   * @returns {Promise<boolean>}
   */
  async validateToken() {
    try {
      await this.client.get('/clans/%232VCVGLJ');
      return true;
    } catch (error) {
      console.error('Invalid API token:', error.message);
      return false;
    }
  }
}

module.exports = new ClashAPI();

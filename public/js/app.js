/**
 * CWL MVP Analyzer - Main Application
 */

class CWLAnalyzer {
  constructor() {
    this.currentAnalysis = null;
    this.init();
  }

  init() {
    this.setupElements();
    this.setupEventListeners();
    this.checkServerHealth();
  }

  setupElements() {
    this.elements = {
      clanTagInput: document.getElementById('clanTagInput'),
      analyzeBtn: document.getElementById('analyzeBtn'),
      loader: document.getElementById('loader'),
      errorMessage: document.getElementById('errorMessage'),
      loadingSection: document.getElementById('loadingSection'),
      resultsSection: document.getElementById('resultsSection'),
      summaryStats: document.getElementById('summaryStats'),
      mvpRecommendation: document.getElementById('mvpRecommendation'),
      rankingContainer: document.getElementById('rankingContainer'),
      playerModal: document.getElementById('playerModal'),
      playerDetails: document.getElementById('playerDetails'),
      closeBtn: document.querySelector('.close-btn')
    };
  }

  setupEventListeners() {
    this.elements.analyzeBtn.addEventListener('click', () => this.handleAnalyze());
    this.elements.clanTagInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.handleAnalyze();
    });
    this.elements.closeBtn.addEventListener('click', () => this.closeModal());
    window.addEventListener('click', (e) => {
      if (e.target === this.elements.playerModal) this.closeModal();
    });
  }

  async checkServerHealth() {
    try {
      await apiClient.health();
      console.log('✓ Server is healthy');
    } catch (error) {
      console.error('✗ Server health check failed:', error);
      this.showError('No se puede conectar con el servidor. Por favor, intenta más tarde.');
    }
  }

  async handleAnalyze() {
    const clanTag = this.elements.clanTagInput.value.trim();

    if (!clanTag) {
      this.showError('Por favor, introduce un tag de clan válido');
      return;
    }

    if (!Utils.validateClanTag(clanTag)) {
      this.showError('Formato de tag inválido. Debe empezar con # seguido de caracteres alfanuméricos');
      return;
    }

    this.analyze(Utils.normalizeClanTag(clanTag));
  }

  async analyze(clanTag) {
    try {
      this.showLoading();
      this.hideError();

      const response = await apiClient.analyzeCWL(clanTag);

      if (response.success) {
        this.currentAnalysis = response.data;
        this.displayResults();
        this.showSuccess(`Análisis completado: ${response.data.ranking.length} jugadores analizados`);
      } else {
        this.showError(response.error || 'Error en el análisis');
      }

    } catch (error) {
      console.error('Analysis error:', error);
      this.showError(`Error: ${error.message}`);
    } finally {
      this.hideLoading();
    }
  }

  displayResults() {
    this.displaySummary();
    this.displayMVPRecommendation();
    this.displayRanking();

    this.elements.resultsSection.classList.remove('hidden');
    this.elements.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  displaySummary() {
    const { summary, warsCount } = this.currentAnalysis;

    const statsHTML = `
      <div class="stat-card">
        <div class="label">Jugadores</div>
        <div class="value">${summary.totalPlayers}</div>
      </div>
      <div class="stat-card">
        <div class="label">Guerras</div>
        <div class="value">${warsCount}</div>
      </div>
      <div class="stat-card">
        <div class="label">Ataques Totales</div>
        <div class="value">${summary.totalAttacks}</div>
      </div>
      <div class="stat-card">
        <div class="label">Estrellas Totales</div>
        <div class="value">${summary.totalStars}</div>
      </div>
      <div class="stat-card">
        <div class="label">⭐ Promedio por Ataque</div>
        <div class="value">${summary.avgStarsPerAttack}</div>
      </div>
      <div class="stat-card">
        <div class="label">💥 Destrucción Promedio</div>
        <div class="value">${summary.avgDestructionPerAttack.toFixed(1)}%</div>
      </div>
    `;

    this.elements.summaryStats.innerHTML = statsHTML;
  }

  displayMVPRecommendation() {
    const { recommendedMVP } = this.currentAnalysis;

    if (!recommendedMVP) {
      this.elements.mvpRecommendation.innerHTML = '';
      return;
    }

    const { player, reasons, score } = recommendedMVP;
    const reasonsList = reasons.map(r => `<li>${r}</li>`).join('');

    const html = `
      <h3>🏆 Recomendación de MVP</h3>
      <div class="mvp-card">
        <div class="mvp-badge">👑</div>
        <div class="mvp-info">
          <h4>${player.name}</h4>
          <div class="score">${score} puntos</div>
        </div>
      </div>
      <div class="mvp-reasons">
        <h4>Razones:</h4>
        <ul>${reasonsList}</ul>
      </div>
    `;

    this.elements.mvpRecommendation.innerHTML = html;
  }

  displayRanking() {
    const { ranking } = this.currentAnalysis;
    let rankingHTML = '';

    ranking.forEach((player, index) => {
      const position = index + 1;
      const positionClass = Utils.getPositionClass(position);
      const badges = this.generateBadgesHTML(player.badges);

      const playerCard = `
        <div class="ranking-card ${positionClass}">
          <div class="position-badge">${position}</div>
          <div class="player-name">${player.name}</div>
          
          <div class="stats-grid">
            <div class="stat-item">
              <div class="label">Puntuación</div>
              <div class="value">${Utils.formatNumber(player.score)}</div>
            </div>
            <div class="stat-item">
              <div class="label">Estrellas</div>
              <div class="value">${player.starsEarned}</div>
            </div>
            <div class="stat-item">
              <div class="label">Promedio ⭐</div>
              <div class="value">${player.avgStars.toFixed(2)}</div>
            </div>
            <div class="stat-item">
              <div class="label">Destrucción</div>
              <div class="value">${player.avgDestruction.toFixed(1)}%</div>
            </div>
            <div class="stat-item">
              <div class="label">Triples</div>
              <div class="value">${player.tripleCount}</div>
            </div>
            <div class="stat-item">
              <div class="label">Ataques</div>
              <div class="value">${player.attacksCount}</div>
            </div>
          </div>

          ${badges}

          <button class="btn view-details-btn" onclick="app.showPlayerDetails('${player.tag}', '${player.name}')">
            Ver Detalles
          </button>
        </div>
      `;

      rankingHTML += playerCard;
    });

    this.elements.rankingContainer.innerHTML = rankingHTML;
  }

  generateBadgesHTML(badges) {
    if (!badges || badges.length === 0) return '';
    const badgesHTML = badges.map(badge => `<div class="badge" title="${badge.name}">${badge.icon} ${badge.name}</div>`).join('');
    return `<div class="badges-container">${badgesHTML}</div>`;
  }

  showPlayerDetails(playerTag, playerName) {
    const player = this.currentAnalysis.ranking.find(p => p.tag === playerTag);
    if (!player) return;

    const detailsHTML = `
      <h2>${player.name}</h2>
      <p style="color: var(--text-secondary); margin-bottom: 20px;">Tag: ${player.tag}</p>
      <h3 style="margin-top: 20px; margin-bottom: 15px;">📊 Estadísticas Generales</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
        <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px;">
          <div style="color: var(--text-secondary); font-size: 0.9rem;">Puntuación Total</div>
          <div style="font-size: 1.8rem; color: var(--accent-color); font-weight: 700;">${Utils.formatNumber(player.score)}</div>
        </div>
        <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px;">
          <div style="color: var(--text-secondary); font-size: 0.9rem;">Estrellas</div>
          <div style="font-size: 1.8rem; color: var(--accent-color); font-weight: 700;">${player.starsEarned}</div>
        </div>
      </div>
      <h3 style="margin-bottom: 15px;">⭐ Desempeño por Estrellas</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px;">
        <div style="background: rgba(76, 175, 80, 0.1); padding: 15px; border-radius: 8px; border-left: 3px solid var(--success-color);">
          <div style="color: var(--text-secondary); font-size: 0.9rem;">Triples (3⭐)</div>
          <div style="font-size: 1.5rem; color: var(--success-color); font-weight: 700;">${player.tripleCount}</div>
        </div>
        <div style="background: rgba(255, 193, 7, 0.1); padding: 15px; border-radius: 8px; border-left: 3px solid var(--accent-color);">
          <div style="color: var(--text-secondary); font-size: 0.9rem;">Dobles (2⭐)</div>
          <div style="font-size: 1.5rem; color: var(--accent-color); font-weight: 700;">${player.doubleCount}</div>
        </div>
        <div style="background: rgba(255, 152, 0, 0.1); padding: 15px; border-radius: 8px; border-left: 3px solid #ff9800;">
          <div style="color: var(--text-secondary); font-size: 0.9rem;">Sencillos (1⭐)</div>
          <div style="font-size: 1.5rem; color: #ff9800; font-weight: 700;">${player.singleCount}</div>
        </div>
      </div>
    `;

    this.elements.playerDetails.innerHTML = detailsHTML;
    this.elements.playerModal.classList.remove('hidden');
  }

  closeModal() {
    this.elements.playerModal.classList.add('hidden');
  }

  showLoading() {
    this.elements.loadingSection.classList.remove('hidden');
    this.elements.resultsSection.classList.add('hidden');
    this.elements.analyzeBtn.disabled = true;
    this.elements.loader.classList.remove('hidden');
  }

  hideLoading() {
    this.elements.loadingSection.classList.add('hidden');
    this.elements.analyzeBtn.disabled = false;
    this.elements.loader.classList.add('hidden');
  }

  showError(message) {
    this.elements.errorMessage.textContent = message;
    this.elements.errorMessage.classList.remove('hidden');
  }

  hideError() {
    this.elements.errorMessage.classList.add('hidden');
  }

  showSuccess(message) {
    Utils.showNotification(message, 'success', 3000);
  }
}

let app;
document.addEventListener('DOMContentLoaded', () => {
  app = new CWLAnalyzer();
  console.log('🚀 CWL MVP Analyzer initialized');
});

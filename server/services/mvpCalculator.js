const config = require('../config/config');

class MVPCalculator {
  constructor() {
    this.scoring = config.MVP_SCORING;
  }

  /**
   * Calcula el MVP Score de un jugador
   * @param {Object} playerData - Datos del jugador
   * @param {Array} attacks - Ataques del jugador
   * @returns {Object} Puntuación y detalles
   */
  calculateMVPScore(playerData, attacks) {
    let totalScore = 0;
    let starsEarned = 0;
    let destructionSum = 0;
    let tripleCount = 0;
    let doubleCount = 0;
    let singleCount = 0;
    let unusedAttacks = 0;
    let superiorEnemyAttacks = 0;

    if (!attacks || attacks.length === 0) {
      return {
        score: 0,
        breakdown: this.getZeroScoreBreakdown(),
        badges: []
      };
    }

    // Procesar cada ataque
    attacks.forEach(attack => {
      const stars = attack.stars || 0;
      const destruction = attack.destructionPercentage || 0;

      // Sumar estrellas y destrucción
      starsEarned += stars;
      destructionSum += destruction;

      // Puntos por estrellas
      if (stars === 3) {
        totalScore += this.scoring.TRIPLE_STARS;
        tripleCount++;
      } else if (stars === 2) {
        totalScore += this.scoring.DOUBLE_STARS;
        doubleCount++;
      } else if (stars === 1) {
        totalScore += this.scoring.SINGLE_STAR;
        singleCount++;
      }

      // Puntos por destrucción
      totalScore += destruction * this.scoring.DESTRUCTION_POINTS_PER_PERCENT;

      // Bonificación por rivales superiores
      if (this.isAttackingSuperiorEnemy(attack)) {
        totalScore += this.scoring.SUPERIOR_ENEMY_BONUS;
        superiorEnemyAttacks++;
      }

      // Penalización por ataques no utilizados
      if (!attack.used) {
        totalScore += this.scoring.UNUSED_ATTACK_PENALTY;
        unusedAttacks++;
      }
    });

    // Bonificación de consistencia
    const consistencyBonus = this.calculateConsistencyBonus(attacks);
    totalScore += consistencyBonus;

    const avgDestruction = attacks.length > 0 ? (destructionSum / attacks.length).toFixed(2) : 0;
    const avgStars = attacks.length > 0 ? (starsEarned / attacks.length).toFixed(2) : 0;

    return {
      score: Math.max(0, Math.round(totalScore)),
      starsEarned,
      avgDestruction: parseFloat(avgDestruction),
      avgStars: parseFloat(avgStars),
      tripleCount,
      doubleCount,
      singleCount,
      attacksCount: attacks.length,
      unusedAttacks,
      superiorEnemyAttacks,
      breakdown: {
        starsPoints: this.calculateStarsPoints(tripleCount, doubleCount, singleCount),
        destructionPoints: Math.round(destructionSum * this.scoring.DESTRUCTION_POINTS_PER_PERCENT),
        superiorEnemyBonus: superiorEnemyAttacks * this.scoring.SUPERIOR_ENEMY_BONUS,
        unusedAttackPenalty: unusedAttacks * this.scoring.UNUSED_ATTACK_PENALTY,
        consistencyBonus: Math.round(consistencyBonus)
      },
      badges: this.generateBadges(tripleCount, starsEarned, avgDestruction, avgStars)
    };
  }

  /**
   * Calcula puntos obtenidos por estrellas
   * @private
   */
  calculateStarsPoints(triples, doubles, singles) {
    return (triples * this.scoring.TRIPLE_STARS) +
           (doubles * this.scoring.DOUBLE_STARS) +
           (singles * this.scoring.SINGLE_STAR);
  }

  /**
   * Verifica si es ataque a enemigo superior
   * @private
   */
  isAttackingSuperiorEnemy(attack) {
    // Si el enemigo tiene Town Hall más alto
    return attack.enemyTownHall > attack.defenderTownHall || false;
  }

  /**
   * Calcula bonificación por consistencia
   * @private
   */
  calculateConsistencyBonus(attacks) {
    if (attacks.length < 2) return 0;

    // Analizar varianza en estrellas
    const avgStars = attacks.reduce((sum, a) => sum + (a.stars || 0), 0) / attacks.length;
    const variance = attacks.reduce((sum, a) => sum + Math.pow((a.stars || 0) - avgStars, 2), 0) / attacks.length;
    const stdDev = Math.sqrt(variance);

    // Menor desviación = más consistente = más bonus
    if (stdDev < 0.5) {
      return this.scoring.CONSISTENCY_BONUS * 2; // Muy consistente
    } else if (stdDev < 1.0) {
      return this.scoring.CONSISTENCY_BONUS; // Consistente
    }
    return 0; // Inconsistente
  }

  /**
   * Genera insignias basadas en desempeño
   * @private
   */
  generateBadges(tripleCount, totalStars, avgDestruction, avgStars) {
    const badges = [];

    if (tripleCount >= 3) {
      badges.push({ name: 'Destructor Triple', icon: '⭐⭐⭐', type: 'elite' });
    }
    if (avgDestruction >= 90) {
      badges.push({ name: 'Máquina de Destrucción', icon: '💥', type: 'destruction' });
    }
    if (avgStars >= 2.8) {
      badges.push({ name: 'Precisión Quirúrgica', icon: '🎯', type: 'precision' });
    }
    if (totalStars >= 15) {
      badges.push({ name: 'Cazador de Estrellas', icon: '⚡', type: 'hunter' });
    }

    return badges;
  }

  /**
   * Desglose de puntuación para jugador sin ataques
   * @private
   */
  getZeroScoreBreakdown() {
    return {
      starsPoints: 0,
      destructionPoints: 0,
      superiorEnemyBonus: 0,
      unusedAttackPenalty: 0,
      consistencyBonus: 0
    };
  }

  /**
   * Genera ranking de jugadores
   * @param {Array} playersData - Array de datos de jugadores con ataques
   * @returns {Array} Ranking ordenado
   */
  generateRanking(playersData) {
    const rankings = playersData.map(playerData => {
      const mvpScore = this.calculateMVPScore(playerData, playerData.attacks);
      return {
        ...playerData,
        ...mvpScore
      };
    });

    // Ordenar por puntuación descendente
    return rankings.sort((a, b) => b.score - a.score);
  }

  /**
   * Obtiene recomendación automática de MVP
   * @param {Array} ranking - Ranking de jugadores
   * @returns {Object} Jugador recomendado y razones
   */
  getRecommendedMVP(ranking) {
    if (!ranking || ranking.length === 0) {
      return null;
    }

    const mvp = ranking[0];
    const reasons = [];

    // Analizar razones
    if (mvp.tripleCount >= 3) {
      reasons.push(`${mvp.tripleCount} Triples obtenidos`);
    }
    if (mvp.avgDestruction >= 90) {
      reasons.push(`Destrucción promedio de ${mvp.avgDestruction}%`);
    }
    if (mvp.superiorEnemyAttacks > 0) {
      reasons.push(`${mvp.superiorEnemyAttacks} ataques exitosos a enemigos superiores`);
    }
    if (mvp.breakdown.consistencyBonus > 0) {
      reasons.push('Desempeño muy consistente');
    }

    if (reasons.length === 0) {
      reasons.push('Mayor puntuación total');
    }

    return {
      player: mvp,
      reasons,
      score: mvp.score,
      position: 1
    };
  }
}

module.exports = new MVPCalculator();

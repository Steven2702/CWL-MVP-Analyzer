const clashAPI = require('../services/clashAPI');
const mvpCalculator = require('../services/mvpCalculator');

class CWLController {
  /**
   * Analiza la Liga de Guerras de un clan
   */
  async analyzeCWL(req, res) {
    try {
      const { clanTag } = req.body;

      if (!clanTag) {
        return res.status(400).json({
          error: 'Clan tag is required'
        });
      }

      // Obtener información de CWL
      const cwlData = await clashAPI.getClanWarLeague(clanTag);

      if (!cwlData.wars || cwlData.wars.length === 0) {
        return res.status(404).json({
          error: 'No CWL wars found for this clan'
        });
      }

      // Procesar datos de guerras
      const playersData = await this.processWarData(cwlData.wars, clanTag);

      // Generar ranking
      const ranking = mvpCalculator.generateRanking(playersData);

      // Obtener MVP recomendado
      const recommendedMVP = mvpCalculator.getRecommendedMVP(ranking);

      // Generar resumen general
      const summary = this.generateSummary(ranking, cwlData);

      res.json({
        success: true,
        data: {
          clanTag,
          ranking,
          recommendedMVP,
          summary,
          warsCount: cwlData.wars.length,
          timestamp: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('Error in analyzeCWL:', error);
      res.status(500).json({
        error: 'Failed to analyze CWL',
        details: error.message
      });
    }
  }

  /**
   * Obtiene detalles de un jugador específico
   */
  async getPlayerDetails(req, res) {
    try {
      const { playerTag } = req.params;

      if (!playerTag) {
        return res.status(400).json({
          error: 'Player tag is required'
        });
      }

      const playerData = await clashAPI.getPlayer(playerTag);

      res.json({
        success: true,
        data: playerData
      });

    } catch (error) {
      console.error('Error in getPlayerDetails:', error);
      res.status(500).json({
        error: 'Failed to fetch player details',
        details: error.message
      });
    }
  }

  /**
   * Procesa datos de guerras
   * @private
   */
  async processWarData(wars, clanTag) {
    const playersMap = new Map();

    for (const warTag of wars) {
      try {
        const warData = await clashAPI.getWar(warTag);

        // Procesar equipo del clan
        if (warData.clan && warData.clan.tag === clanTag) {
          this.processTeamMembers(warData.clan.members, playersMap, warData);
        }
      } catch (error) {
        console.warn(`Error processing war ${warTag}:`, error.message);
      }
    }

    return Array.from(playersMap.values());
  }

  /**
   * Procesa miembros de un equipo
   * @private
   */
  processTeamMembers(members, playersMap, warData) {
    members.forEach(member => {
      if (!playersMap.has(member.tag)) {
        playersMap.set(member.tag, {
          tag: member.tag,
          name: member.name,
          townHall: member.townHall,
          mapPosition: member.mapPosition,
          attacks: []
        });
      }

      const playerData = playersMap.get(member.tag);

      // Agregar ataques
      if (member.attacks) {
        member.attacks.forEach(attack => {
          playerData.attacks.push({
            stars: attack.stars,
            destructionPercentage: attack.destructionPercentage,
            defenderTag: attack.defenderTag,
            defenderTownHall: warData.opponent?.members?.find(m => m.tag === attack.defenderTag)?.townHall,
            used: true,
            warStartTime: warData.startTime,
            warId: warData.id
          });
        });
      }

      // Registrar ataques no utilizados
      if (warData.teamSize) {
        const maxAttacks = 2; // En CWL típicamente 2 ataques por jugador
        const usedAttacks = member.attacks ? member.attacks.length : 0;
        for (let i = usedAttacks; i < maxAttacks; i++) {
          playerData.attacks.push({
            stars: 0,
            destructionPercentage: 0,
            defenderTag: null,
            used: false,
            warStartTime: warData.startTime,
            warId: warData.id
          });
        }
      }
    });
  }

  /**
   * Genera resumen general de la CWL
   * @private
   */
  generateSummary(ranking, cwlData) {
    const totalAttacks = ranking.reduce((sum, p) => sum + p.attacksCount, 0);
    const totalStars = ranking.reduce((sum, p) => sum + p.starsEarned, 0);
    const avgStarsPerAttack = totalAttacks > 0 ? (totalStars / totalAttacks).toFixed(2) : 0;
    const avgDestructionPerAttack = ranking.reduce((sum, p) => sum + p.avgDestruction, 0) / ranking.length;

    const topScorer = ranking[0] || {};
    const topTriplePlayers = ranking.filter(p => p.tripleCount > 0).sort((a, b) => b.tripleCount - a.tripleCount);
    const topDestroyers = ranking.sort((a, b) => b.avgDestruction - a.avgDestruction);

    return {
      totalPlayers: ranking.length,
      totalAttacks,
      totalStars,
      avgStarsPerAttack: parseFloat(avgStarsPerAttack),
      avgDestructionPerAttack: parseFloat(avgDestructionPerAttack.toFixed(2)),
      topScorerName: topScorer.name,
      topScorerScore: topScorer.score,
      mostTriplesPlayer: topTriplePlayers[0]?.name,
      mostTriplesCount: topTriplePlayers[0]?.tripleCount || 0,
      topDestroyerName: topDestroyers[0]?.name,
      topDestroyerPercentage: topDestroyers[0]?.avgDestruction || 0
    };
  }
}

module.exports = new CWLController();

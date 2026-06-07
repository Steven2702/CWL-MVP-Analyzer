require('dotenv').config();

module.exports = {
  // Server Configuration
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Clash of Clans API
  CLASH_API_TOKEN: process.env.CLASH_API_TOKEN,
  CLASH_API_BASE_URL: 'https://api.clashroyale.com/v1',

  // Rate Limiting
  RATE_LIMIT_WINDOW: parseInt(process.env.RATE_LIMIT_WINDOW) || 15,
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,

  // CORS Configuration
  CORS_ORIGIN: process.env.NODE_ENV === 'production' 
    ? process.env.PRODUCTION_URL 
    : 'http://localhost:3000',

  // MVP Scoring Configuration
  MVP_SCORING: {
    TRIPLE_STARS: 100,
    DOUBLE_STARS: 60,
    SINGLE_STAR: 25,
    DESTRUCTION_POINTS_PER_PERCENT: 0.5,
    SUPERIOR_ENEMY_BONUS: 15,
    UNUSED_ATTACK_PENALTY: -20,
    CONSISTENCY_BONUS: 10
  }
};

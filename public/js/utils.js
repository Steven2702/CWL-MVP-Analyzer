/**
 * Utility Functions
 */

const Utils = {
  formatNumber(num) {
    return new Intl.NumberFormat('es-ES').format(num);
  },

  getPositionEmoji(position) {
    const emojis = { 1: '🥇', 2: '🥈', 3: '🥉' };
    return emojis[position] || '📊';
  },

  getPositionClass(position) {
    const classes = { 1: 'first', 2: 'second', 3: 'third' };
    return classes[position] || '';
  },

  validateClanTag(tag) {
    const regex = /^#[A-Z0-9]{3,}$/i;
    return regex.test(tag);
  },

  normalizeClanTag(tag) {
    if (!tag) return '';
    tag = tag.trim().toUpperCase();
    if (!tag.startsWith('#')) {
      tag = '#' + tag;
    }
    return tag;
  },

  calculatePercentage(current, total) {
    if (total === 0) return 0;
    return ((current / total) * 100).toFixed(1);
  },

  showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
      color: white;
      border-radius: 8px;
      z-index: 9999;
      animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, duration);
  }
};

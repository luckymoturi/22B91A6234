export class Logger {
  static log(level, message, data = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      data,
      sessionId: 'session_' + Date.now()
    };
    const logs = JSON.parse(localStorage.getItem('app_logs') || '[]');
    logs.push(logEntry);
    localStorage.setItem('app_logs', JSON.stringify(logs.slice(-100)));
  }

  static info(message, data) {
    this.log('info', message, data);
  }

  static warn(message, data) {
    this.log('warn', message, data);
  }

  static error(message, data) {
    this.log('error', message, data);
  }
}

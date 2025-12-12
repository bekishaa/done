/**
 * Centralized logging utility to replace console.log statements
 * Provides structured logging with different log levels
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: string;
  data?: any;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private formatMessage(level: LogLevel, message: string, context?: string, data?: any): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? `[${context}]` : '';
    return `${timestamp} ${level.toUpperCase()} ${contextStr} ${message}`;
  }

  private log(level: LogLevel, message: string, context?: string, data?: any): void {
    if (!this.isDevelopment && level === 'debug') {
      return; // Skip debug logs in production
    }

    const formattedMessage = this.formatMessage(level, message, context, data);
    
    switch (level) {
      case 'debug':
        console.debug(formattedMessage, data || '');
        break;
      case 'info':
        console.info(formattedMessage, data || '');
        break;
      case 'warn':
        console.warn(formattedMessage, data || '');
        break;
      case 'error':
        console.error(formattedMessage, data || '');
        break;
    }
  }

  debug(message: string, context?: string, data?: any): void {
    this.log('debug', message, context, data);
  }

  info(message: string, context?: string, data?: any): void {
    this.log('info', message, context, data);
  }

  warn(message: string, context?: string, data?: any): void {
    this.log('warn', message, context, data);
  }

  error(message: string, context?: string, data?: any): void {
    this.log('error', message, context, data);
  }
}

export const logger = new Logger();


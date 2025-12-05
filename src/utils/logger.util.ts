type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isProduction = process.env.NODE_ENV === 'production';

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

    if (context && Object.keys(context).length > 0) {
      return `${prefix} ${message} ${JSON.stringify(context)}`;
    }

    return `${prefix} ${message}`;
  }

  info(message: string, context?: LogContext): void {
    if (this.isProduction) {
      process.stdout.write(this.formatMessage('info', message, context) + '\n');
    } else {
      process.stdout.write(`${message}\n`);
    }
  }

  warn(message: string, context?: LogContext): void {
    process.stderr.write(this.formatMessage('warn', message, context) + '\n');
  }

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const errorContext = {
      ...context,
      ...(error instanceof Error && {
        error: error.message,
        stack: error.stack,
      }),
    };

    process.stderr.write(this.formatMessage('error', message, errorContext) + '\n');
  }

  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      process.stdout.write(this.formatMessage('debug', message, context) + '\n');
    }
  }

  sql(query: string): void {
    if (this.isDevelopment) {
      process.stdout.write(`[SQL] ${query}\n`);
    }
  }
}

export const logger = new Logger();

import { Logger } from '@nestjs/common';

class ColoredLogger extends Logger {
  private getColorPrefix(color: string, context?: string) {
    const reset = '\x1b[0m';
    return `${color}[GAME gateway] (${context}): ${reset}`;
  }

  log(message: any, context?: string) {
    const blue = '\x1b[34m';
    super.log(message, context, false);
    process.stdout.write(
      this.getColorPrefix(blue, context) + ' ' + message + '\n',
    );
  }

  error(message: any, context?: string, trace?: string) {
    const red = '\x1b[31m';
    super.error(message, trace, context);
    process.stderr.write(
      this.getColorPrefix(red, context) + ' ' + message + '\n',
    );
  }

  warn(message: any, context?: string) {
    const yellow = '\x1b[33m';
    super.warn(message, context);
    process.stdout.write(
      this.getColorPrefix(yellow, context) + ' ' + message + '\n',
    );
  }
}

export default ColoredLogger;

import { createLogger, transports, format, transport, exitOnError } from 'winston';

const logger = createLogger({
  transports: [
    new transports.File({
      level: 'info',
      filename: './logs/app.log',
      maxFiles: 5,
      maxsize: 5242880,
    }),

    new transports.Console({
      level: 'debug',
      handleExceptions: true
    })
  ],

  exitOnError: false
});

// Log to console if not in prod. Check winston docs.
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.simple(),
  }));
}

export default logger;
import winston from 'winston'
import fs from 'fs'
import path from 'path'

/**
 * Logger utility using Winston for logging messages to both file and console.
 *
 * - Logs are stored in the 'logs/app.log' file.
 * - Console output is also enabled.
 * - Log messages include timestamp, log level, and message.
 *
 * @module logger
 * @see {@link https://github.com/winstonjs/winston|Winston Documentation}
 */

const logDir = 'logs'
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir)

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => `[${timestamp}] ${level}: ${message}`)
  ),
  transports: [
    new winston.transports.File({ filename: path.join(logDir, 'app.log') }),
    new winston.transports.Console()
  ]
})

export default logger
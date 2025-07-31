import winston from 'winston'
import fs from 'fs'
import path from 'path'

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
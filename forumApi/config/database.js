// db.js
import pg from 'pg';
import CONFIG from './config.js';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';
import CONFIG from './config.js';
dotenv.config();


const { Pool } = pg;

let poolInstance;

function getPool() {
  if (!poolInstance) {
    poolInstance = new Pool({
      connectionString: CONFIG.DATABASE_URL,
      connectionString: CONFIG.DATABASE_URL,
    });

    poolInstance.connect()
      .then(client => {
        logger.info('Connexion à PostgreSQL');
        client.release();
      })
      .catch(err => {
        logger.info('Erreur de connexion à PostgreSQL:',err.stack);
      });
  }

  return poolInstance;
}

export default getPool(); 


// db.js
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

let poolInstance;

function getPool() {
  if (!poolInstance) {
    poolInstance = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    poolInstance.connect()
      .then(client => {
        console.log('Connecté à PostgreSQL');
        client.release();
      })
      .catch(err => {
        console.error(' Erreur de connexion à PostgreSQL:', err.stack);
      });
  }

  return poolInstance;
}

export default getPool(); 


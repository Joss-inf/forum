import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Si vous n'utilisez pas DATABASE_URL, vous pouvez configurer comme ceci :
  // user: process.env.PG_USER,
  // host: process.env.PG_HOST,
  // database: process.env.PG_DATABASE,
  // password: process.env.PG_PASSWORD,
  // port: process.env.PG_PORT,
});

// Pour vérifier que la connexion est bien établie au démarrage
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Erreur de connexion à la base de données', err.stack);
  }
  console.log('Connecté à la base de données PostgreSQL avec succès.');
  client.release();
});

export default pool;
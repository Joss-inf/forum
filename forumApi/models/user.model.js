import db from '../config/database.js';

export async function create({ username, email, password_hash }) {
  const query = `
    INSERT INTO users (username, email, password_hash)
    VALUES ($1, $2, $3)
    RETURNING id, username, email, created_at;
  `;
  const { rows } = await db.query(query, [username, email, password_hash]);
  return rows[0];
}

export async function findByEmail(email) {
  // On liste explicitement les colonnes. On a besoin du hash ici pour la comparaison.
  const query = 'SELECT id, username, email, password_hash, created_at FROM users WHERE email = $1;';
  const { rows } = await db.query(query, [email]);
  return rows[0];
}


export async function findByEmailOrUsername(email, username) {
  const query = 'SELECT * FROM users WHERE email = $1 OR username = $2;';
  const { rows } = await db.query(query, [email, username]);
  return rows[0];
}

export async function findById(id) {
  // On exclut volontairement le hash du mot de passe.
  // Si un service a besoin du hash, il doit utiliser une fonction spécifique.
  const query = 'SELECT id, username, email, created_at FROM users WHERE id = $1;';
  const { rows } = await db.query(query, [id]);
  return rows[0];
}
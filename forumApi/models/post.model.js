import db from '../config/database.js';

export async function create({ title, content, userId }) {
  const query = `
    INSERT INTO posts (title, content, user_id)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const { rows } = await db.query(query, [title, content, userId]);
  return rows[0];
}

export async function findById(id) {
  const query = 'SELECT id, user_id, title, content, created_at FROM posts WHERE id = $1;';
  const { rows } = await db.query(query, [id]);
  return rows[0];
}

export async function findByIdWithAuthor(id) {
  const query = `
    SELECT 
      p.id, p.user_id, p.title, p.content, p.created_at, 
      u.username AS author_username
    FROM posts p
    JOIN users u ON p.user_id = u.id
    WHERE p.id = $1;
  `;
  const { rows } = await db.query(query, [id]);
  return rows[0];
}

export async function findAll(options = {}) {
  // On définit des valeurs par défaut robustes.
  const page = parseInt(options.page, 10) || 1;
  const limit = parseInt(options.limit, 10) || 10; // Défaut à 10
  const offset = (page - 1) * limit;

  // On s'assure que la limite ne peut pas être abusivement haute.
  const effectiveLimit = Math.min(limit, 50); // Plafond à 50 par requête

  const query = `
    SELECT 
      p.id, p.user_id, p.title, p.created_at, 
      u.username AS author_username
    FROM posts p
    JOIN users u ON p.user_id = u.id
    ORDER BY p.created_at DESC
    LIMIT $1 OFFSET $2;
  `;
  // Note: On ne sélectionne pas p.content ici pour alléger la liste.
  // Le client devra faire une requête sur le post spécifique pour avoir le contenu complet.
  const { rows } = await db.query(query, [effectiveLimit, offset]);
  return rows;
}


export async function update(id, { title, content }) {
  const query = `
    UPDATE posts
    SET title = $1, content = $2
    WHERE id = $3
    RETURNING id, user_id, title, content, created_at;
  `;
  const { rows } = await db.query(query, [title, content, id]);
  return rows[0];
}

export async function remove(id) {
  const query = 'DELETE FROM posts WHERE id = $1;';
  await db.query(query, [id]);
}
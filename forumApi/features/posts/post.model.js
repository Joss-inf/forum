import db from '../../config/database.js';
import withTransaction from '../../utils/withTransaction.js'
import * as queries from './post.queries.js'

export async function create({ title, content, userId }) {
  const { rows } = await db.query(queries.insertPost(title, content, userId));
  return rows[0];
}

export async function findById(id) {
  const { rows } = await db.query(queries.selectPostById(id));
  return rows[0];
}

export async function findByIdWithAuthor(id) {
  const { rows } = await db.query(queries.selectPostWithAuthor(id));
  return rows[0];
}

export async function findAll(options = {}) {
  const limit = Math.min(parseInt(options.limit, 10) || 10, 50);
  const cursor = options.cursor ? parseInt(options.cursor, 10) : null;

  let query;
  let params;

  if (cursor) {
    // Pagination avec curseur (posts avec un id < cursor)
    query = `
      SELECT 
        p.id, p.user_id, p.title, p.created_at, 
        u.username AS author_username
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.id < $1
      ORDER BY p.id DESC
      LIMIT $2;
    `;
    params = [cursor, limit];
  } else {
    // Première page
    query = `
      SELECT 
        p.id, p.user_id, p.title, p.created_at, 
        u.username AS author_username
      FROM posts p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.id DESC
      LIMIT $1;
    `;
    params = [limit];
  }

  const { rows } = await db.query(query, params);
  return rows;
}

export async function update(id, { title, content }) {
  return withTransaction(async (client) => {
    const existing = await client.query(queries.selectPostIdForUpdate(id));
    if (existing.rowCount === 0) throw new Error('Post not found');

    const { rows } = await client.query(queries.updatePost(title, content, id));
    return rows[0];
  });
}

export async function remove(id) {
  await db.query(queries.deletePost(id));
}
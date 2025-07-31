import db from '../config/database.js';

export async function create({ content, userId, postId }) {
  const query = `
    INSERT INTO comments (content, user_id, post_id)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const { rows } = await db.query(query, [content, userId, postId]);
  return rows[0];
}

export async function findById(id) {
  const query = 'SELECT * FROM comments WHERE id = $1;';
  const { rows } = await db.query(query, [id]);
  return rows[0];
}

export async function findByPostId(postId) {
  const query = `
    SELECT c.*, u.username AS author_username
    FROM comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.post_id = $1
    ORDER BY c.created_at ASC;
  `;
  const { rows } = await db.query(query, [postId]);
  return rows;
}

export async function update(id, { content }) {
  const query = `
    UPDATE comments
    SET content = $1
    WHERE id = $2
    RETURNING *;
  `;
  const { rows } = await db.query(query, [content, id]);
  return rows[0];
}

export async function remove(id) {
  const query = 'DELETE FROM comments WHERE id = $1;';
  await db.query(query, [id]);
}
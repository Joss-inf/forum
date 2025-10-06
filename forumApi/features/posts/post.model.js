import db from '../../config/database.js';
import withTransaction from '../../utils/withTransaction.js'
import * as queries from './post.queries.js'

export async function create({ title, content, userId, tagId }) {
  const { rows } = await db.query(queries.insertPost(title, content, userId, tagId));
  return rows[0];
}

export async function findPostById(id) {
  const { rows } = await db.query(queries.selectPostById(id));
  return rows[0];
}

export async function findByIdWithAuthor(id) {
  const { rows } = await db.query(queries.selectPostWithAuthor(id));
  return rows[0];
}

export async function findAll({ limit = 10, cursorCreatedAt = null, cursorId = null, tag = null, titleSearch = null, order = 'DESC' } = {}) {
  const finalLimit = Math.min(Number.isInteger(Number(limit)) ? Number(limit) : 10, 50);

  const { rows } = await db.query(queries.selectAllPosts({
      cursorCreatedAt, cursorId, limit: finalLimit, tag, titleSearch, order
    }));

  const hasMore = rows.length === finalLimit;
  return { posts: rows, hasMore };
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
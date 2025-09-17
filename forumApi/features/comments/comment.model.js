import db from '../../config/database.js';
import withTransaction from '../../utils/withTransaction.js'
import * as queries from './comment.queries.js'

export async function create({ content, userId, postId }) {
  const { rows } = await db.query(queries.insertComment(content, userId, postId));
  return rows[0];
}

export async function findById(id) {
  const { rows } = await db.query(queries.selectCommentById(id));
  return rows[0];
}

export async function findByPostId(postId) {
  const { rows } = await db.query(queries.selectCommentsByPostId(postId));
  return rows;
}

export async function update(id, { content }) {
  return await withTransaction(async (client) => {

    const existing = await client.query(queries.selectCommentForUpdate(id));
    if (existing.rowCount === 0) throw new Error('Comment not found');

    const { rows } = await client.query(queries.updateComment(content, id));
    return rows[0];
  });
}

export async function remove(id) {
  const { rowCount } = await db.query(queries.deleteComment(id));
  return rowCount;
}
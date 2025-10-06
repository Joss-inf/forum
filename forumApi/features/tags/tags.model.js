import db from '../../config/database.js';
import withTransaction from '../../utils/withTransaction.js'
import * as queries from './tags.queries.js'

export async function createTag(tag) {
  const { rows } = await db.query(queries.insertTag(tag));
  return rows[0];
}

export async function ObtainAllsTags() {
  const { rows } = await db.query(queries.selectAllTags());
  return rows;
}

export async function getTagById(id) {
  const { rows } = await db.query(queries.selectTagById(id));
  return rows[0];
}


export async function updateTag(id, name) {
  return withTransaction(async (client) => {

    const existing = await client.query(queries.selectTagIdForUpdate(id));
    if (existing.rowCount === 0) throw new Error('Tag not found');

    const { rows } = await client.query(queries.updateTag(id, name));
    return rows[0];
  });
}

export async function deleteTag(id) {
  const { rows } = await db.query(queries.deleteTag(id));
  return rows[0];
}

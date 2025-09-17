import db from '../../config/database.js';
import * as queries from './auth.queries.js';
import withTransaction from '../../utils/withTransaction.js';
import { NotFoundError } from '../../utils/errors.js'

export async function create({ username, email, password_hash }) {
  const { rows } = await db.query(queries.insertUser(username, email, password_hash));
  return rows[0];
}

export async function findByEmail(email) {
  const { rows } = await db.query(queries.selectUserByEmail(email));
  return rows[0];
}

export async function getUserPasswordHash(id){
 const { rows }  =  await db.query(queries.selectPasswordById(id));
 return rows[0];
}

export async function updatePassword(id, password_hash) {
  return await withTransaction(async (client) => {

    const existing = await client.query(queries.selectUserIdForUpdate(id));
    if (existing.rowCount === 0) throw new NotFoundError('Utilisateur non trouvé');

    const result = await client.query(queries.updateUserPassword(password_hash, id));
    return result.rows[0];
  });
}
import db from '../../config/database.js';
import withTransaction from '../../utils/withTransaction.js';
import { NotFoundError,AuthenticationError } from '../../utils/errors.js'
import * as queries from './user.queries.js';

export async function findByEmail(email) {
  const { rows } = await db.query(queries.selectUserByEmail(email));
  return rows[0];
}

export async function findByEmailOrUsername(email, username) {
  const { rows } = await db.query(queries.selectUserByEmailOrUsername(email, username));
  return rows[0];
}

export async function findById(id) {
  const { rows } = await db.query(queries.selectUserById(id));
  return rows[0];
}

export async function updateProfile(id, { username, email }) {
  return await withTransaction(async (client) => {

    const { rows } = await client.query(queries.selectUserIdForUpdate(id));
    const user = rows[0];
    
    if (!user) throw new NotFoundError('Utilisateur non trouvé');
    if (user.email !== email || user.username !== username) throw new AuthenticationError('Les informations ne correspondent pas à l’état actuel.');
  
    const result = await client.query(queries.updateUserProfile(username, email, id));
    return result.rows[0];
  });
}

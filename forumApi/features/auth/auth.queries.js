export const insertUser = (username, email, password_hash) => ({
  name: 'insert-user',
  text: `
    INSERT INTO users (username, email, password_hash, role)
    VALUES ($1, $2, $3, 'user')
    RETURNING id, username, email, role, created_at;
  `,
  values: [username, email, password_hash],
});

export const selectUserByEmail = (email) => ({
  name: 'select-user-by-email',
  text: `
    SELECT id, username, email, password_hash, created_at
    FROM users
    WHERE email = $1;
  `,
  values: [email],
});

export const selectPasswordById = (id) => ({
  name: 'select-password-by-id',
  text: `
    SELECT password_hash
    FROM users
    WHERE id = $1;
  `,
  values: [id],
});

export const selectUserIdForUpdate = (id) => ({
  name: 'select-user-for-update',
  text: `
    SELECT id
    FROM users
    WHERE id = $1
    FOR UPDATE;
  `,
  values: [id],
});

export const updateUserPassword = (password_hash, id) => ({
  name: 'update-user-password',
  text: `
    UPDATE users
    SET password_hash = $1
    WHERE id = $2
    RETURNING id;
  `,
  values: [password_hash, id],
});
export const selectUserByEmailOrUsername = (email, username) => ({
  name: 'select-user-by-email-or-username',
  text: `
    SELECT id, username, email, created_at
    FROM users
    WHERE email = $1 OR username = $2;
  `,
  values: [email, username],
});

export const selectUserById = (id) => ({
  name: 'select-user-by-id',
  text: `
    SELECT id, username, email, created_at
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

export const updateUserProfile = (username, email, id) => ({
  name: 'update-user-profile',
  text: `
    UPDATE users
    SET username = $1, email = $2
    WHERE id = $3
    RETURNING id, username, email, created_at;
  `,
  values: [username, email, id],
});

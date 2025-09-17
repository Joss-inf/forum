// posts.queries.js

// Crée un nouveau post
export const insertPost = (title, content, userId) => ({
  name: 'insert-post',
  text: `
    INSERT INTO posts (title, content, user_id)
    VALUES ($1, $2, $3)
    RETURNING id, title, content, user_id AS "userId", created_at;
  `,
  values: [title, content, userId],
});

// Récupère un post par ID
export const selectPostById = (id) => ({
  name: 'select-post-by-id',
  text: `
    SELECT id, user_id, title, content, created_at
    FROM posts
    WHERE id = $1;
  `,
  values: [id],
});

// Récupère un post avec les infos de l’auteur
export const selectPostWithAuthor = (id) => ({
  name: 'select-post-with-author',
  text: `
    SELECT 
      p.id, p.user_id, p.title, p.content, p.created_at, 
      u.username AS author_username
    FROM posts p
    JOIN users u ON p.user_id = u.id
    WHERE p.id = $1;
  `,
  values: [id],
});

// Récupère les derniers posts avec pagination
export const selectAllPosts = (limit) => ({
  name: 'select-all-posts',
  text: `
    SELECT 
      p.id, p.user_id, p.title, p.created_at, 
      u.username AS author_username
    FROM posts p
    JOIN users u ON p.user_id = u.id
    ORDER BY p.id DESC
    LIMIT $1;
  `,
  values: [limit],
});

// Récupère les posts après un curseur (pagination)
export const selectPostsAfterCursor = (cursor, limit) => ({
  name: 'select-posts-after-cursor',
  text: `
    SELECT 
      p.id, p.user_id, p.title, p.created_at, 
      u.username AS author_username
    FROM posts p
    JOIN users u ON p.user_id = u.id
    WHERE p.id < $1
    ORDER BY p.id DESC
    LIMIT $2;
  `,
  values: [cursor, limit],
});

export const selectPostIdForUpdate = (id) => ({
  name: 'select-post-id-for-update',
  text: 'SELECT id FROM posts WHERE id = $1 FOR UPDATE;',
  values: [id],
});

export const updatePost = (title, content, id) => ({
  name: 'update-post',
  text: `
    UPDATE posts
    SET title = $1, content = $2
    WHERE id = $3
    RETURNING id, user_id, title, content, created_at;
  `,
  values: [title, content, id],
});

// Supprime un post
export const deletePost = (id) => ({
  name: 'delete-post',
  text: `DELETE FROM posts WHERE id = $1;`,
  values: [id],
});

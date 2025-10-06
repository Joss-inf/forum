// posts.queries.js

// Crée un nouveau post
export const insertPost = (title, content, userId,tagId) => ({
  name: 'insert-post',
  text: `
    INSERT INTO posts (title, content, user_id, tag_id )
    VALUES ($1, $2, $3, $4)
    RETURNING id, title, content, user_id AS "userId", tag_id AS "tagId", created_at, updated_at;
  `,
  values: [title, content, userId,tagId],
});

// Récupère un post par ID
export const selectPostById = (id) => ({
  name: 'select-post-by-id',
  text: `
    SELECT p.id, p.user_id, p.title, t.name AS tag_name, p.content, p.created_at
    FROM posts p
    JOIN tags t ON p.tag_id = t.id
    WHERE id = $1;
  `,
  values: [id],
});

// Récupère un post avec les infos de l’auteur
export const selectPostWithAuthor = (id) => ({
  name: 'select-post-with-author',
  text: `
    SELECT 
      p.id, p.user_id, p.title, t.name AS tag_name, p.content, p.created_at, 
      u.username AS author_username
    FROM posts p
    JOIN users u ON p.user_id = u.id
    JOIN tags t ON p.tag_id = t.id
    WHERE p.id = $1;
  `,
  values: [id],
});

// Récupère les derniers posts avec pagination
export const selectAllPosts = ({ 
  cursorCreatedAt, 
  cursorId, 
  limit, 
  tag, 
  titleSearch, 
  order = 'DESC' 
}) => {
  const orderDir = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  return {
    name: 'select-all-posts',
    text: `
      SELECT 
        p.id,
        p.user_id,
        p.title,
        p.created_at,
        u.username AS author_username,
        t.name AS tag_name
      FROM posts p
      JOIN users u ON p.user_id = u.id
      JOIN tags t ON p.tag_id = t.id
      WHERE 
        ($1::timestamptz IS NULL OR (p.created_at, p.id) < ($1, $2))
        AND ($3::int IS NULL OR p.tag_id = $3)
        AND ($4::text IS NULL OR p.title ILIKE '%' || $4 || '%')
      ORDER BY p.created_at ${orderDir}, p.id ${orderDir}
      LIMIT $5;
    `,
    values: [
      cursorCreatedAt || null,
      cursorId || null,
      tag || null,
      titleSearch || null,
      limit || 10
    ],
  };
};

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

// comments.queries.js

// Crée un commentaire
export const insertComment = (content, userId, postId) => ({
  name: 'insert-comment',
  text: `
    INSERT INTO comments (content, user_id, post_id)
    VALUES ($1, $2, $3)
    RETURNING *;
  `,
  values: [content, userId, postId],
});

// Trouve un commentaire par son ID
export const selectCommentById = (id) => ({
  name: 'select-comment-by-id',
  text: `
    SELECT * FROM comments WHERE id = $1;
  `,
  values: [id],
});

// Liste des commentaires d’un post (avec auteur)
export const selectCommentsByPostId = (postId) => ({
  name: 'select-comments-by-post-id',
  text: `
    SELECT c.*, u.username AS author_username
    FROM comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.post_id = $1
    ORDER BY c.created_at ASC;
  `,
  values: [postId],
});

// Lock d’un commentaire pour update (FOR UPDATE)
export const selectCommentForUpdate = (id) => ({
  name: 'select-comment-for-update',
  text: `
    SELECT id FROM comments WHERE id = $1 FOR UPDATE;
  `,
  values: [id],
});

// Met à jour un commentaire
export const updateComment = (content, id) => ({
  name: 'update-comment',
  text: `
    UPDATE comments
    SET content = $1
    WHERE id = $2
    RETURNING *;
  `,
  values: [content, id],
});

export const deleteComment = (id) => ({
  name: 'delete-comment',
  text: `
    DELETE FROM comments WHERE id = $1 RETURNING id;
  `,
  values: [id],
});

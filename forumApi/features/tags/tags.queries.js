export const insertTag = (name) => ({
  name: 'insert-tag',
  text: `
    INSERT INTO tags (name)
    VALUES ($1)
    ON CONFLICT (name) DO NOTHING
    RETURNING id, name, created_at, updated_at;
  `,
  values: [name],
});

export const selectAllTags = () => ({
  name: 'select-all-tags',
  text: `
    SELECT id, name, created_at, updated_at
    FROM tags
    ORDER BY created_at DESC;
  `,
  values: [],
});

export const selectTagById = (id) => ({
  name: 'select-tag-by-id',
  text: `
    SELECT id, name, created_at, updated_at
    FROM tags
    WHERE id = $1;
  `,
  values: [id],
});

export const selectTagIdForUpdate = (id) => ({
  name: 'select-tag-id-for-update',
  text: 'SELECT id FROM tags WHERE id = $1 FOR UPDATE;',
  values: [id],
});

export const updateTag = (id, name) => ({
  name: 'update-tag',
  text: `
    UPDATE tags
    SET name = $1
    WHERE id = $2
    RETURNING id, name, created_at, updated_at;
  `,
  values: [name, id],
});

export const deleteTag = (id) => ({
  name: 'delete-tag',
  text: `
    DELETE FROM tags
    WHERE id = $1
    RETURNING id;
  `,
  values: [id],
});
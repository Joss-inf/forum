import * as PostModel from '../models/post.model.js';
import { NotFoundError, AuthorizationError } from '../utils/errors.js';

export async function createPost(postData) {
  return PostModel.create(postData);
}

export async function getAllPosts(options = {}) {
  // Le modèle gérera la logique de pagination (LIMIT/OFFSET)
  return PostModel.findAll(options);
}

export async function getPostById(postId) {
  const post = await PostModel.findByIdWithAuthor(postId); // On veut aussi l'auteur
  if (!post) {
    throw new NotFoundError('Post non trouvé.');
  }
  return post;
}

export async function updateUserPost({ postId, userId, postUpdates }) {
  const post = await PostModel.findById(postId);
  if (!post) {
    throw new NotFoundError('Post non trouvé.');
  }

  // Vérification cruciale : l'utilisateur est-il le propriétaire du post ?
  if (post.user_id !== userId) {
    throw new AuthorizationError('Vous n\'êtes pas autorisé à modifier ce post.');
  }

  return PostModel.update(postId, postUpdates);
}

export async function deleteUserPost({ postId, userId }) {
  const post = await PostModel.findById(postId);
  if (!post) {
    throw new NotFoundError('Post non trouvé.');
  }

  // Vérification cruciale : l'utilisateur est-il le propriétaire du post ?
  if (post.user_id !== userId) {
    throw new AuthorizationError('Vous n\'êtes pas autorisé à supprimer ce post.');
  }

  await PostModel.remove(postId);
}
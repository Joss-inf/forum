import * as CommentModel from '../models/comment.model.js';
import * as PostModel from '../models/post.model.js';
import { NotFoundError, AuthorizationError } from '../utils/errors.js';

export async function createComment(commentData) {
  // Vérifier que le post existe avant de commenter
  const postExists = await PostModel.findById(commentData.postId);
  if (!postExists) {
    throw new NotFoundError('Le post que vous essayez de commenter n\'existe pas.');
  }
  return CommentModel.create(commentData);
}

export async function getCommentsByPostId(postId) {
  return CommentModel.findByPostId(postId);
}

export async function updateUserComment({ commentId, userId, content }) {
  const comment = await CommentModel.findById(commentId);
  if (!comment) {
    throw new NotFoundError('Commentaire non trouvé.');
  }

  if (comment.user_id !== userId) {
    throw new AuthorizationError('Vous n\'êtes pas autorisé à modifier ce commentaire.');
  }

  return CommentModel.update(commentId, { content });
}

export async function deleteUserComment({ commentId, userId }) {
  const comment = await CommentModel.findById(commentId);
  if (!comment) {
    throw new NotFoundError('Commentaire non trouvé.');
  }

  if (comment.user_id !== userId) {
    throw new AuthorizationError('Vous n\'êtes pas autorisé à supprimer ce commentaire.');
  }

  await CommentModel.remove(commentId);
}
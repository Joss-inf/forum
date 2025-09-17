import * as CommentModel from './comment.model.js';
import * as PostModel from '../posts/post.model.js';
import { NotFoundError, AuthorizationError } from '../../utils/errors.js';

export async function createComment(commentData) {
  const postExists = await PostModel.findById(commentData.postId);
  if (!postExists) throw new NotFoundError('Le post que vous essayez de commenter n\'existe pas.');
  const newComment = await CommentModel.create(commentData);
  return newComment;
}

export async function getCommentsByPostId(postId) {
  return CommentModel.findByPostId(postId);
}

export async function updateUserComment({ commentId, userId, content }) {
  const comment = await CommentModel.findById(commentId);
  if (!comment) throw new NotFoundError('Commentaire non trouvé.');
  if (comment.user_id !== userId) throw new AuthorizationError('Vous n\'êtes pas autorisé à modifier ce commentaire.');
  const updatedComment = await CommentModel.update(commentId, { content });
  return updatedComment;
}

export async function deleteUserComment({ commentId, userId }) {
  const comment = await CommentModel.findById(commentId);
  if (!comment) throw new NotFoundError('Commentaire non trouvé.');
  if (comment.user_id !== userId) throw new AuthorizationError('Vous n\'êtes pas autorisé à supprimer ce commentaire.');
  await CommentModel.remove(commentId);
}
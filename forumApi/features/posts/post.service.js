// services/postService.js

import * as PostModel from './post.model.js';
import * as CommentModel from '../posts/post.model.js';

import { NotFoundError, AuthorizationError } from '../../utils/errors.js';
import hasPrivilege  from '../../utils/privilegeCheck.js';

// --- Fonctions de service pour les posts ---

export async function createPost(postData) {
  return PostModel.create(postData);
}

export async function getAllPosts(options = {}) {
  return PostModel.findAll(options);
}

export async function getPostById(postId) {
  const post = PostModel.findByIdWithAuthor(postId);
  if (!post) throw new NotFoundError('Post non trouvé.');
  return post;
}

export async function getCommentsByPostId(postId) {
  return  CommentModel.findByPostId(postId);
}

export async function updateUserPost({ postId, userId, postUpdates }) {
  const post = await PostModel.findById(postId);
  if (!post) throw new NotFoundError('Post non trouvé.');
  if (post.user_id !== userId ) throw new AuthorizationError('Vous n\'êtes pas autorisé à modifier ce post.');
  const updatedPost = await PostModel.update(postId, postUpdates);
  return updatedPost;
}

export async function deleteUserPost({ postId, userId, userRole }) {
  const post = await PostModel.findById(postId);
  if (!post) throw new NotFoundError('Post non trouvé.');
  if (hasPrivilege(post.user_id,userId,userRole)) {
    await PostModel.remove(postId);
  } else {
    throw new AuthorizationError('Vous n\'êtes pas autorisé à effectuer cette action.');
  }
}
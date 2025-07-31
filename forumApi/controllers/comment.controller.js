import { validationResult } from 'express-validator';
import * as CommentService from '../services/comment.service.js';

export async function createComment(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const commentData = {
    content: req.body.content,
    postId: req.params.postId,
    userId: req.user.id,
  };
  const newComment = await CommentService.createComment(commentData);
  res.status(201).json(newComment);
}

export async function getCommentsForPost(req, res) {
  const { postId } = req.params;
  const comments = await CommentService.getCommentsByPostId(postId);
  res.status(200).json(comments);
}

export async function updateComment(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const commentId = req.params.id;
  const userId = req.user.id;
  const { content } = req.body;
  
  const updatedComment = await CommentService.updateUserComment({ commentId, userId, content });
  res.status(200).json(updatedComment);
}

export async function deleteComment(req, res) {
  const commentId = req.params.id;
  const userId = req.user.id;
  
  await CommentService.deleteUserComment({ commentId, userId });
  res.status(204).send();
}
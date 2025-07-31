import { validationResult } from 'express-validator';
import * as PostService from '../services/post.service.js';

export async function createPost(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const postData = {
    title: req.body.title,
    content: req.body.content,
    userId: req.user.id,
  };
  const newPost = await PostService.createPost(postData);
  res.status(201).json(newPost);
}

export async function updatePost(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const postId = req.params.id;
  const userId = req.user.id;
  const postUpdates = req.body;

  const updatedPost = await PostService.updateUserPost({ postId, userId, postUpdates });
  res.status(200).json(updatedPost);
}

export async function getAllPosts(req, res) {
  const { page, limit } = req.query;
  const posts = await PostService.getAllPosts({ page, limit });
  res.status(200).json(posts);
}

export async function getPostById(req, res) {
  const postId = req.params.id;
  const post = await PostService.getPostById(postId);
  
  if (!post) {
    return res.status(404).json({ message: 'Post non trouvé.' });
  }
  res.status(200).json(post);
}

export async function deletePost(req, res) {
  const postId = req.params.id;
  const userId = req.user.id;

  await PostService.deleteUserPost({ postId, userId });
  res.status(204).send();
}
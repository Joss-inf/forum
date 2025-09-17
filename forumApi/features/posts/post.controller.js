import * as PostService from './post.service.js';

export async function createPost(req, res, next) {
  try {
    const postData = {
      title: req.body.title,
      content: req.body.content,
      userId: req.user.id,
    };
    const newPost = await PostService.createPost(postData);
    res.status(201).json(newPost);
  } catch (error) {
    next(error);
  }
}

export async function updatePost(req, res, next) {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    const postUpdates = req.body;
    const userRole = req.user.role;
    const updatedPost = await PostService.updateUserPost({ postId, userId, userRole, postUpdates });
    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
}

export async function getAllPosts(req, res, next) {
  try {
    const { page, limit } = req.query;
    const posts = await PostService.getAllPosts({ page, limit });
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
}

export async function getPostById(req, res, next) {
  try {
    const postId = req.params.id;
    const post = await PostService.getPostById(postId);
    if (!post) return res.status(404).json({ message: 'Post non trouvé.' });
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
}

export async function deletePost(req, res, next) {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;
    await PostService.deleteUserPost({ postId, userId, userRole });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

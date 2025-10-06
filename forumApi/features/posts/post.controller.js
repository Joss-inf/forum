import * as PostService from './post.service.js';

export async function createPost(req, res, next) {
  try {
    const postData = {
      title: req.body.title,
      content: req.body.content,
      userId: req.user.id,
      tagId: req.body.tag_id,
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
    const { limit, cursorCreatedAt, cursorId, tag, titleSearch, order } = req.query;

    const result = await PostService.getAllPosts({
      limit, cursorCreatedAt, cursorId, tag, titleSearch, order
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function getPostById(req, res, next) {
  try {
    const postId = req.params.id;
    const post = await PostService.getPostById(postId);
    console.log(post)
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
    res.status(204).send({ message: 'Post supprimé avec succès.' });
  } catch (error) {
    next(error);
  }
}

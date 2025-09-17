import * as CommentService from './comment.service.js';

export async function createComment(req, res, next) {
  try {
    const commentData = {
      content: req.body.content,
      postId: req.params.postId,
      userId: req.user.id,
    };
    const newComment = await CommentService.createComment(commentData);
    res.status(201).json(newComment);
  } catch (error) {
    next(error);
  }
}

export async function getCommentsForPost(req, res, next) {
  try {
    const { postId } = req.params;
    const comments = await CommentService.getCommentsByPostId(postId);
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
}

export async function updateComment(req, res, next) {
  try {
    const commentId = req.params.id;
    const userId = req.user.id;
    const { content } = req.body;

    const updatedComment = await CommentService.updateUserComment({ commentId, userId, content });
    res.status(200).json(updatedComment);
  } catch (error) {
    next(error);
  }
}

export async function deleteComment(req, res, next) {
  try {
    const commentId = req.params.id;
    const userId = req.user.id;
    const rowcount = await CommentService.deleteUserComment({ commentId, userId });
    if (rowcount === 0) {
      // Tu peux créer une erreur personnalisée ici pour dire que la suppression a échoué
      const error = new Error('Commentaire non trouvé ou suppression non autorisée.');
      error.status = 404;
      throw error;
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

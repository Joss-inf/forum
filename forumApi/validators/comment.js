import Joi from 'joi';

const commentSchema = Joi.object({
  postId: Joi.string().required(),
  content: Joi.string().min(1).max(1000).required(),
});

export default function validateComment(req, res, next) {
  const { error } = commentSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
}

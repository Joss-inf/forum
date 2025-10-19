import Joi from 'joi';

const postSchema = Joi.object({
  title: Joi.string().min(5).max(100).required(),
  content: Joi.string().min(20).max(5000).required(),
  tags: Joi.array().items(Joi.string()).required(),
});

export default function validatePost(req, res, next) {
  const { error } = postSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
}

import Joi from 'joi';

const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  confirmEmail: Joi.ref('email'), 
  password: Joi.string().min(8).required(),
  confirmPassword: Joi.ref('password'),
}).with('password', 'confirmPassword')
  .with('email', 'confirmEmail');


export default function validateRegister(req, res, next) {
  const { error } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
}

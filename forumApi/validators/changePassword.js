import Joi from 'joi';

const changePasswordSchema = Joi.object({
  password: Joi.string().required(),
  newPassword: Joi.string().min(8).required(),
  confirmNewPassword: Joi.ref('newPassword'),
});

export default function validateChangePassword(req, res, next) {
  const { error } = changePasswordSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
}
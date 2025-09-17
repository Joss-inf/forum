
/**
 * Middleware to validate request using express-validator.
 * If validation errors exist, responds with 400 and error details.
 *
 * @function validate
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {void}
 */

/**
 * Returns validation rules for user login.
 * Validates email and password fields.
 *
 * @function loginRules
 * @returns {Array} Array of express-validator middleware for login.
 */

/**
 * Returns validation rules for user registration.
 * Validates username, email, confirmEmail, password, and confirmPassword fields.
 *
 * @function registerRules
 * @returns {Array} Array of express-validator middleware for registration.
 */

/**
 * Returns validation rules for creating a post.
 * Validates title and content fields.
 *
 * @function postRules
 * @returns {Array} Array of express-validator middleware for post creation.
 */

/**
 * Returns validation rules for creating a comment.
 * Validates text field.
 *
 * @function commentRules
 * @returns {Array} Array of express-validator middleware for comment creation.
 */

import { body, validationResult } from 'express-validator';


export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const loginRules = () => {
  return [
    body('email')
      .isEmail().withMessage('Email ou mot de passe invalide.'),
      
    body('password')
      .notEmpty().withMessage('Email ou mot de passe invalide.')
      .isLength({ min: 8, max: 256 }).withMessage('Le mot de passe doit contenir entre 8 et 256 caractères.')
  ];
};

export const registerRules = () => {
  return [
    body('username')
      .notEmpty().withMessage('Le pseudo est requis.')
      .isLength({ min: 3, max: 64 }).withMessage('Le pseudo doit contenir entre 3 et 64 caractères.'),

    body('email')
      .isEmail().withMessage("Le format de l'email est invalide.")
      .isLength({ max: 64 }).withMessage("L'email ne doit pas dépasser 64 caractères."),

    body('confirmEmail')
      .isEmail().withMessage("Le format de l'email de confirmation est invalide.")
      .custom((value, { req }) => {
        if (value !== req.body.email) {
          throw new Error('Les adresses email ne correspondent pas.');
        }
        return true;
      }),

    body('password')
      .isLength({ min: 8, max: 256 }).withMessage('Le mot de passe doit contenir entre 8 et 256 caractères.')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/)
      .withMessage('Le mot de passe doit contenir au moins une minuscule, une majuscule et un caractère spécial (!@#$%^&*).'),

    body('confirmPassword')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Les mots de passe ne correspondent pas.');
        }
        return true;
      }),
  ];
};

export const postRules = () => {
  return [
    body('title')
      .notEmpty().withMessage('Le titre est requis.')
      .isLength({ max: 128 }).withMessage('Le titre ne doit pas dépasser 128 caractères.'),
    
    body('content')
      .notEmpty().withMessage('Le contenu est requis.')
      .isLength({ max: 4096 }).withMessage('Le contenu ne doit pas dépasser 4096 caractères.'),
  ];
};

export const commentRules = () => {
  return [
    body('text')
      .notEmpty().withMessage('Le commentaire est requis.')
      .isLength({ max: 2048 }).withMessage('Le commentaire ne doit pas dépasser 2048 caractères.'),
  ];
};
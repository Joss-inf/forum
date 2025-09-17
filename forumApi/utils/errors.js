/**
 * Base class for HTTP errors.
 *
 * @class HttpError
 * @extends Error
 * @param {string} name - Name of the error.
 * @param {number} statusCode - HTTP status code.
 * @param {string} message - Error message.
 * @property {string} name - The name of the error.
 * @property {number} statusCode - The HTTP status code.
 */
class HttpError extends Error {
  constructor(name, statusCode, message) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error when a requested resource is not found.
 * @class NotFoundError
 * @extends HttpError
 */
export class NotFoundError extends HttpError {
  constructor(message = 'Ressource non trouvée') {
    super('NotFoundError', 404, message);
  }
}

/**
 * Error when a user tries to access a resource without permission.
 * @class AuthorizationError
 * @extends HttpError
 */
export class AuthorizationError extends HttpError {
  constructor(message = 'Action non autorisée') {
    super('AuthorizationError', 403, message);
  }
}

/**
 * Error when a request conflicts with current state (e.g., duplicate entry).
 * @class ConflictError
 * @extends HttpError
 */
export class ConflictError extends HttpError {
  constructor(message = 'Un conflit est survenu') {
    super('ConflictError', 409, message);
  }
}

/**
 * Error when authentication fails (e.g., invalid credentials).
 * @class AuthenticationError
 * @extends HttpError
 */
export class AuthenticationError extends HttpError {
  constructor(message = 'Identifiants invalides') {
    super('AuthenticationError', 401, message);
  }
}
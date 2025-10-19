import { NotFoundError } from '../utils/errors.js';

// eslint-disable-next-line no-unused-vars
export default function notFound(req, _res, _next) {
  throw new NotFoundError(`La ressource demandée n'existe pas : ${req.originalUrl}`);
}
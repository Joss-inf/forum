// Erreur pour les ressources non trouvées -> 404 Not Found
export class NotFoundError extends Error {
  constructor(message = 'Ressource non trouvée') {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

// Erreur pour les problèmes d'autorisation -> 403 Forbidden
export class AuthorizationError extends Error {
  constructor(message = 'Action non autorisée') {
    super(message);
    this.name = 'AuthorizationError';
    this.statusCode = 403;
  }
}

// Erreur pour les conflits (ex: l'email existe déjà) -> 409 Conflict
export class ConflictError extends Error {
  constructor(message = 'Un conflit est survenu') {
    super(message);
    this.name = 'ConflictError';
    this.statusCode = 409;
  }
}

// Erreur pour des identifiants invalides -> 401 Unauthorized
export class AuthenticationError extends Error {
    constructor(message = 'Identifiants invalides') {
        super(message);
        this.name = 'AuthenticationError';
        this.statusCode = 401;
    }
}
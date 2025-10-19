
const csrfMiddleware = (req, res, next) => {
  const csrfCookie = req.cookies.csrf_token || req.signedCookies.csrf_token;
  const csrfHeader = req.headers['x-csrf-token'];
  console.log('csrf',csrfCookie,req.headers )
  if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
    return res.status(403).json({ message: 'Token CSRF invalide ou manquant.' });
  }
  next();
};

export default csrfMiddleware;
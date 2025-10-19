import CONFIG from '../../../config/config.js';

export function setAuthCookie(res, jwtToken) {
  res.cookie('auth_token', jwtToken, {
    httpOnly: false,
    secure: false,
    sameSite: 'Strict',
    maxAge: 2 * 60 * 60 * 1000,
    signed: true
  })
}

export function setCsrfCookie(res, csrfSignedToken) {
  res.cookie('csrf_token', csrfSignedToken, {
    httpOnly: false,
    secure: false,
    sameSite: 'Strict',
    maxAge: 2 * 60 * 60 * 1000,
    signed: false
  });
}

export function clearAccessTokenCookie(res) {
  res.clearCookie('auth_token', {
    httpOnly: true,
    secure: CONFIG.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    signed: true,
  });
}

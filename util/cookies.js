import { serialize } from 'cookie';

export function createSerializedSessionTokenCookie(token) {
  // check if we are in production (Heroku)
  const isProduction = process.env.NODE_ENV === 'production';

  const maxAge = 60 * 10; // 10 minutes

  return serialize('sessionToken', token, {
    maxAge: maxAge,

    expires: new Date(Date.now() + maxAge * 1000),

    // Important for security
    httpOnly: true,
    // Set secure cookies in production (Heroku)
    secure: isProduction,
    path: '/',
    // Be explicit about default behavior in browsers
    sameSite: 'lax',
  });
}

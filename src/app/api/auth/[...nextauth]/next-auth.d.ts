import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      USER_NAME: string;
      USER_ROLE: string;
      USER_AUTHORIZED: boolean;
      access_token: string;
    };
  }

  interface Token {
    sub: string,
    user: {
      id: string,
      USER_NAME: string,
      USER_ROLE: string,
      USER_AUTHORIZED: true,
      access_token: string,
    },
    iat: number,
    exp: number,
    jti: string,
  }
}

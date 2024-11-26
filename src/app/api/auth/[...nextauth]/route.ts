import { API_BASE_URL } from '@/utils/apiBaseUrl';
import axios from 'axios';
import NextAuth, { NextAuthOptions, Session } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

interface PostReqProps {
  USER_NAME: string;
  USER_PASSWORD: string;
}

interface PostResProps {
  access_token: string;
}

interface PayloadProps {
  sub: string;
  name: string;
  iat: number;
  exp: number;
}

interface GetResProps {
  id: string;
  USER_NAME: string;
  USER_ROLE: 'ADMIN' | 'USER';
  USER_AUTHORIZED: boolean;
}

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        USER_NAME: { label: 'Username', type: 'text' },
        USER_PASSWORD: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) throw new Error('Credencias não fornecidas.');
        try {
          const { data: { access_token } } = await axios.post<PostResProps>(`${API_BASE_URL}/auth/login`, {
            USER_NAME: credentials.USER_NAME,
            USER_PASSWORD: credentials.USER_PASSWORD,
          } as PostReqProps);

          const payload: PayloadProps = JSON.parse(Buffer.from(access_token.split('.')[1], 'base64').toString());

          if (!payload.sub) throw new Error('Token inválido: ID do usuário não encontrado.');

          const { data: user } = await axios.get<GetResProps>(`${API_BASE_URL}/users/${payload.sub}`, {
            headers: {
              Authorization: `Bearer ${access_token}`
            }
          })

          return { ...user, access_token };
        } catch (error) {
          throw new Error('Falha ao autenticar. Verifique suas credenciais.');
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) return { ...token, user };
      return token;
    },
    async session({ session, token }) {
      const user = token.user as Session['user'];
      if (user) {
        const { data: updateUser } = await axios.get<GetResProps>(`${API_BASE_URL}/users/${user.id}`, {
          headers: {
            Authorization: `Bearer ${user.access_token}`
          }
        });
        return { ...session, user: { ...updateUser, access_token: user.access_token } };
      };
      return session;
    },
  },
  pages: { signIn: '/' },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST, authOptions };

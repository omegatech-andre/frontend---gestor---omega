export interface UserDetails {
  id: string;
  USER_NAME: string;
  USER_AUTHORIZED: boolean;
  USER_ROLE: 'ADMIN' | 'USER';
  createdAt: string;
}

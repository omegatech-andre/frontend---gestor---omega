export interface UserGetDetails {
  id: string;
  USER_NAME: string;
  USER_AUTHORIZED: boolean;
  USER_ROLE: 'ADMIN' | 'USER';
  createdAt: string;
}

export interface UserPostDetails {
  USER_NAME?: string;
  USER_AUTHORIZED?: boolean;
  USER_ROLE?: 'ADMIN' | 'USER';
}

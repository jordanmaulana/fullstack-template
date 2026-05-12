export interface AuthUser {
  id: number;
  email: string;
  onboarded: boolean;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

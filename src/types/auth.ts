export interface AuthUser {
  uuid: string;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
}

export interface UserProfile extends AuthUser {
  phone: string | null;
  email_verified_at: string | null;
}

export interface AuthTokenResponse {
  access_token: string;
  token_type: "Bearer";
  user: AuthUser;
}
export interface UpdateProfilePayload {
  name?: string;
  phone?: string | null;
}

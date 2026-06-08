export type LoginRequestDto = {
  username: string;
  password: string;
};

export type LoginResponseDto = {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  id_token: string;
  session_state: string;
  scope: string;
};

export type LogoutRequestDto = {
  refreshToken: string;
};
export interface UserLoginResponse {
  accessToken: string;
  refreshToken: string;
  userData: userLoginInfo;
}

export interface userLoginInfo {
  email: string;
  name: string;
  surname: string;
  id: number;
}

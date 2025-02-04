export interface User {
  name: string;
  login: string;
  html_url: string;
}

export interface UserResponse extends User {
  login: string;
}

export interface User {
  name: string;
  login: string;
  html_url: string;
  avatar_url: string;
}

export interface UserResponse extends User {
  login: string;
}

export interface Repo {
  id: number;
  name: string;
  html_url: string;
  private: boolean;
}

export type GetRepoResponse = Repo[];

import type { User } from './github-rest';

interface TokenData {
  id: string;
  user: User;
}

export interface SessionData {
  tokens: TokenData[];
}

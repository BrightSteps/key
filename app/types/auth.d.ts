import type { User } from './github';

interface TokenData {
  id: string;
  user: User;
}

export interface SessionData {
  tokens: TokenData[];
}

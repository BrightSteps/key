import { User } from './user.d.ts';

interface TokenData {
  id: string;
  user: User;
}

export interface SessionData {
  tokens: TokenData[];
}
